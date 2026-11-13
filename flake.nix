{
  description = "Expo SDK 55 Android Build Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";

      pkgs = import nixpkgs {
        inherit system;

        config = {
          android_sdk.accept_license = true;
          allowUnfree = true;
        };
      };

      # Android SDK
      androidComposition = pkgs.androidenv.composeAndroidPackages {
        # Expo SDK 55
        platformVersions = [ "36" ];

        # Expo e módulos nativos podem solicitar versões diferentes
        buildToolsVersions = [
          "35.0.0"
          "36.0.0"
        ];

        # Command-line Tools
        cmdLineToolsVersion = "latest";
        platformToolsVersion = "latest";

        includeEmulator = false;
        includeSystemImages = false;
        includeSources = false;

        # React Native 0.83
        includeNDK = true;
        ndkVersions = [ "27.1.12297006" ];

        # Ferramentas nativas
        includeCmake = true;
        cmakeVersions = [ "3.22.1" ];
      };

      androidSdk = androidComposition.androidsdk;

      androidSdkPath = "${androidSdk}/libexec/android-sdk";

      androidNdkPath = "${androidSdkPath}/ndk-bundle";

      aapt2BuildToolsVersion = "36.0.0";

      java = pkgs.jdk21;

    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          # Java
          jdk21

          # JavaScript / Expo
          nodejs_24
          bun

          # Android
          androidSdk

          # Utilitários
          git
          curl
          unzip
          zip
          python3
        ];

        # Android SDK
        ANDROID_HOME = androidSdkPath;
        ANDROID_SDK_ROOT = androidSdkPath;

        # Android NDK
        ANDROID_NDK_HOME = androidNdkPath;
        ANDROID_NDK_ROOT = androidNdkPath;

        # Java
        JAVA_HOME = "${java}";

        # AAPT2 fornecido pelo Nix
        GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${androidSdkPath}/build-tools/${aapt2BuildToolsVersion}/aapt2";

        shellHook = ''
          echo ""
          echo " Android Build"
          echo ""

          echo "Java:"
          java -version

          echo ""
          echo "Node:"
          node --version

          echo ""
          echo "Bun:"
          bun --version

          echo ""
          echo "Android SDK:"
          echo "$ANDROID_HOME"

          echo ""
          echo "Android NDK:"
          echo "$ANDROID_NDK_HOME"

          echo ""

          # Configuração local do SDK para o Gradle
          if [ -d "$PWD/android" ]; then
            printf 'sdk.dir=%s\n' "$ANDROID_HOME" \
              > "$PWD/android/local.properties"
          fi

          # Compatibilidade Foojay com Gradle 9
          if [ -d "$PWD/node_modules/.bun" ]; then
            find "$PWD/node_modules/.bun" \
              -type f \
              -path '*/@react-native/gradle-plugin/settings.gradle.kts' \
              -exec sed -i \
                's/version("0.5.0")/version("1.0.0")/g' {} +
          fi

          echo "Ambiente Android configurado."
          echo ""
        '';
      };
    };
}
