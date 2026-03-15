import AccessControl "./access-control";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (accessControlState : AccessControl.AccessControlState) {
  // Stable admin principal - survives all upgrades and canister restarts
  stable var _stableAdminPrincipal : ?Principal = null;

  // Initialize auth: first caller with correct token becomes admin permanently
  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    if (caller.isAnonymous()) { return };
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) {
        Runtime.trap("CAFFEINE_ADMIN_TOKEN environment variable is not set");
      };
      case (?adminToken) {
        if (userSecret == adminToken) {
          switch (_stableAdminPrincipal) {
            case (null) {
              // First admin registration - store permanently
              _stableAdminPrincipal := ?caller;
              // Also update legacy state for compatibility
              AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
            };
            case (?existingAdmin) {
              // Admin already set; if it's the same person just re-register in legacy state
              if (caller == existingAdmin) {
                AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
              };
              // Different caller - silently ignore, admin is locked
            };
          };
        } else {
          // Wrong token - register as regular user in legacy state
          AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
        };
      };
    };
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    switch (_stableAdminPrincipal) {
      case (?admin) { caller == admin };
      case (null) { false };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };
};
