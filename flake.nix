{
  description = "Rust backend project with devShell and nix run support";

  # Inputs
  inputs = {
    # Nixpkgs is needed for Rust and rust-analyzer
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  # Define outputs
  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      # Package the Rust binary
      packages.default = pkgs.stdenv.mkDerivation {
        pname = "user-space-backend";
        version = "0.1.0";

        # Build the project from the backend folder
        src = ./.;

        buildInputs = [ pkgs.rustc pkgs.cargo ];

        buildPhase = ''
          echo "Building the Rust backend project..."
          cargo build --release --manifest-path ./backend/Cargo.toml
        '';

        installPhase = ''
          mkdir -p $out/bin
          cp ./backend/target/release/user-space-backend $out/bin/
        '';
      };

      # nix run target to execute the built binary
      apps.default = {
        type = "app";
        program = "${self.packages.${system}.default}/bin/user-space-backend";
      };

      # Dev shell with rust-analyzer and Rust tools
      devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.rustc
          pkgs.cargo
          pkgs.rust-analyzer
        ];

        shellHook = ''
          echo "Entering development shell for Rust backend project..."
        '';
      };
    }
  );
}
