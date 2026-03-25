import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  // Stable storage for access control state (kept for upgrade compatibility)
  stable var stableAdminAssigned : Bool = false;
  stable var stableUserRolesEntries : [(Principal, AccessControl.UserRole)] = [];

  let accessControlState : AccessControl.AccessControlState = {
    var adminAssigned = stableAdminAssigned;
    userRoles = Map.empty<Principal, AccessControl.UserRole>();
  };

  include MixinAuthorization(accessControlState);

  // Simple admin principal -- first caller to invoke claimAdmin becomes admin
  stable var adminPrincipal : ?Principal = null;

  // Claim admin role -- only works if no admin is set yet
  public shared ({ caller }) func claimAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (adminPrincipal) {
      case (null) {
        adminPrincipal := ?caller;
        true;
      };
      case (?_) { false };
    };
  };

  // Check if caller is admin using the simple principal-based system
  public query ({ caller }) func isCallerAdminSimple() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (adminPrincipal) {
      case (?admin) { caller == admin };
      case (null) { false };
    };
  };

  func requireAdmin(caller : Principal) {
    let ok = switch (adminPrincipal) {
      case (?admin) { caller == admin };
      case (null) { false };
    };
    if (not ok) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    priceInCents : Nat;
    category : Text;
    sizeML : Nat;
    stockQuantity : Nat;
    imageId : Text;
    featured : Bool;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    priceInCents : Nat;
    category : Text;
    sizeML : Nat;
    stockQuantity : Nat;
    imageId : Text;
    featured : Bool;
  };

  module Product {
    public func compareByName(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  // Stable storage for products
  stable var productsEntries : [(Nat, Product)] = [];
  stable var nextProductId : Nat = 1;

  var products = Map.empty<Nat, Product>();

  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    items : [OrderItem];
    totalAmount : Nat;
    createdAt : Int;
  };

  // Stable storage for orders
  stable var ordersEntries : [(Nat, Order)] = [];
  stable var nextOrderId : Nat = 1;

  var orders = Map.empty<Nat, Order>();

  // Legacy stub - kept to avoid upgrade compatibility errors (M0169)
  stable var _stableAdminPrincipal : ?Principal = null;

  public type UserProfile = { name : Text };
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Preserve state across upgrades
  system func preupgrade() {
    productsEntries := products.entries().toArray();
    ordersEntries := orders.entries().toArray();
    stableAdminAssigned := accessControlState.adminAssigned;
    stableUserRolesEntries := accessControlState.userRoles.entries().toArray();
  };

  system func postupgrade() {
    for ((k, v) in productsEntries.vals()) {
      products.add(k, v);
    };
    productsEntries := [];
    for ((k, v) in ordersEntries.vals()) {
      orders.add(k, v);
    };
    ordersEntries := [];
    accessControlState.adminAssigned := stableAdminAssigned;
    for ((k, v) in stableUserRolesEntries.vals()) {
      accessControlState.userRoles.add(k, v);
    };
    stableUserRolesEntries := [];
  };

  public shared ({ caller }) func addProduct(productData : ProductInput) : async Nat {
    requireAdmin(caller);
    let id = nextProductId;
    nextProductId += 1;
    let product : Product = {
      id;
      name = productData.name;
      description = productData.description;
      priceInCents = productData.priceInCents;
      category = productData.category;
      sizeML = productData.sizeML;
      stockQuantity = productData.stockQuantity;
      imageId = productData.imageId;
      featured = productData.featured;
    };
    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updateData : ProductInput) : async () {
    requireAdmin(caller);
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name = updateData.name;
          description = updateData.description;
          priceInCents = updateData.priceInCents;
          category = updateData.category;
          sizeML = updateData.sizeML;
          stockQuantity = updateData.stockQuantity;
          imageId = updateData.imageId;
          featured = updateData.featured;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    requireAdmin(caller);
    products.remove(id);
  };

  public query func listProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByName);
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query func listByCategory(category : Text) : async [Product] {
    switch (category) {
      case ("all") {
        products.values().toArray().sort(Product.compareByName);
      };
      case (_) {
        products.values().toArray().filter(func(p) { p.category == category }).sort(Product.compareByName);
      };
    };
  };

  public query func listFeatured() : async [Product] {
    products.values().toArray().filter(func(p) { p.featured });
  };

  public shared func placeOrder(customerName : Text, customerEmail : Text, items : [OrderItem]) : async Nat {
    if (items.size() == 0) {
      Runtime.trap("Items array cannot be empty");
    };
    let total = items.foldLeft(0, func(acc : Nat, item : OrderItem) : Nat {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product does not exist") };
        case (?product) { acc + (product.priceInCents * item.quantity) };
      };
    });
    let order : Order = {
      id = nextOrderId;
      customerName;
      customerEmail;
      items;
      totalAmount = total;
      createdAt = Time.now();
    };
    orders.add(nextOrderId, order);
    let currentId = nextOrderId;
    nextOrderId += 1;
    currentId;
  };

  public query ({ caller }) func listOrders() : async [Order] {
    requireAdmin(caller);
    orders.values().toArray();
  };
};
