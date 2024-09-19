{
  description = "Website to get to know each other better";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs?rev=75a5ebf473cd60148ba9aec0d219f72e5cf52519";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = { self, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit self; } {
      imports = [];
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      perSystem = { config, self', inputs', pkgs, system, ... }: {
        devShells = {
          default = pkgs.mkShell {
              buildInputs = with pkgs; [
                nodePackages.typescript
                nodePackages.typescript-language-server
                nodePackages.cspell
              ];
          };
        };
        packages = rec {
          default = site;

          site = pkgs.stdenv.mkDerivation {
            buildInputs = with pkgs; [ nodePackages.typescript ];
            src = ./site;
            name = "site";
            buildPhase = ''
              cd ts
              tsc --build
              cd ..
            '';

            installPhase = ''
              mkdir $out
              mkdir $out/ts
              cp ./index.html $out
              cp -r ./css $out/css
              cp ./ts/index.js $out/ts
            '';
          };
        };
        checks = {
            spellcheck = pkgs.stdenv.mkDerivation {
              name = "spellcheck";
              dontUnpack = true;
              src = ./.;
              buildInputs = [ pkgs.nodePackages.cspell ];
              doCheck = true;
              checkPhase = ''
                cd $src/.
                cspell lint --no-progress "**"
                touch $out
              '';
            };
        };
      };
      flake = {};
    };
}
