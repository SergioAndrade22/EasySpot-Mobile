# Aplicación para el registro de ubicación GPS de tortugas marinas

El desarrollo de esta aplicación se realiza en conjunto con el equipo de investigación y preservación del departamento de Biología de la Universidad Nacional del Sur en un esfuerzo para la protección y conservación de las tortugas marinas en la ría de Bahía Blanca.

## Configuración para instalar

    1. Clonar el proyecto
    2. Correr `npm install` para instalar las dependencias necesarias
    3. Buildear el proyecto en ios:
        3.1. `npx cap add ios` <- Añade la plataforma de iOS
        3.2. `ionic capacitor copy ios` <- Buildea la aplicación para iOS
        3.3. Navegar hasta la carpeta ios/App dónde se debería encontrar el archivo Podfile
            3.3.A. Es necesario tener las dependencias necesarias para poder ejecutar los comando usando pod. Se recomienda seguir [esta guía](https://mac.install.guide/ruby/index.html).
            3.3.B. Instalar cocoapods: `sudo gem install cocoapods`
                3.3.B.*. De ser necesario, instalar Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
        3.4. `pod deintegrate` <- Remueve cualquier instancia previa o cache
        3.5. `pod install` <- Agrega las configuraciones y dependencias necesarias
        3.6. Localizar el archivo Info.plist, suele estar ubicado en `ios/App/App`.
        3.7. Agregar, dentro de la llave `<dict>` de dicho archivo, las siguientes líneas:

```xml
<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>location-services</string>
    <string>gps</string>
</array>
<key>NSLocationAlwaysUsageDescription</key>
<string>Necesario para poder registrar la ubicación al momento en que se acciona el botón</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necesario para poder registrar la ubicación al momento en que se acciona el botón</string>
```

        3.A. Para verificar la correcta configuración anterior:
            3.A.1 `ionic capacitor open ios` <- Abre el editor xCode (requiere instalación previa)
            3.A.2 Una vez dentro de xCode, confiugrar el emulador deseado.
            3.A.3 Una vez el emulador iniciado aceptar el uso de la ubicación y dirigirse a Featores>Location, elegir la configuración deseada y use la aplicación.
    4. Builder el proyecto para Android:
        4.1. `npx cap add Android` <- Añade la plataforma de Android
        4.2. `ionic capacitor copy android` <- Buildea la aplicación para Android
        4.3. Agregar las siguientes línas al archivo AndroidManifest.xml, localizado dentro de la carpeta creada `android/app/src/main`:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
```

        4.A. Para verificar la correcta configuración anterior:
            4.A.1. `ionic capacitor open android` <- Abre el editor Android Studio (requiere instalación previa)
            4.A.2 Una vez dentro de xCode, confiugrar el emulador deseado.
            4.A.3 Una vez el emulador iniciado aceptar el uso de la ubicación y dirigirse a Featores>Location, elegir la configuración deseada y use la aplicación.
    5. Si se desea probar la aplicación de manera web es suficiente con correr `ionic serve`
