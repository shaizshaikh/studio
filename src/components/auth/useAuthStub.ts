// src/components/auth/useAuthStub.ts
export function useAuth() {
  return {
    user: null,
    loading: false,
    isAdmin: false,
    signInWithGoogle: async () => {
      console.log("Auth disabled: signInWithGoogle stub called");
    },
    logout: async () => {
      console.log("Auth disabled: logout stub called");
    },
  };
}
