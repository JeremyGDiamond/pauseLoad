# simple.nix
with (import <nixpkgs> {});
  mkShell {
    buildInputs = [
      web-ext
    ];
  }