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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  var products = Map.empty<Nat, Product>();
  var nextProductId = 1;

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

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func addProduct(productData : ProductInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let value = products.get(id);
    switch (value) {
      case (null) {
        Runtime.trap("Product does not exist");
      };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    products.remove(id);
  };

  public query func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProduct(id : Nat) : async ?Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { ?product };
    };
  };

  public query func listByCategory(category : Text) : async [Product] {
    switch (category) {
      case ("all") { products.values().toArray().sort() };
      case (_) {
        products.values().toArray().filter(func(p) { p.category == category });
      };
    };
  };

  public query func listFeatured() : async [Product] {
    products.values().toArray().filter(func(p) { p.featured });
  };

  public shared ({ caller }) func placeOrder(customerName : Text, customerEmail : Text, items : [OrderItem]) : async Nat {
    if (items.size() == 0) {
      Runtime.trap("Items array cannot be empty");
    };

    let total = items.foldLeft(0, func(acc, item) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
