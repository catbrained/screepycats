{
  description = "My code for Screeps";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" ];
      forEachSystem = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forEachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShellNoCC {
            nativeBuildInputs = [ pkgs.typescript pkgs.nodePackages_latest.pnpm pkgs.nodePackages_latest.nodejs ];
            shellHook = ''
              git log --oneline -3
            '';
          };
        });
    };
}
