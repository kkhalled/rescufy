# Rescufy

Emergency response mobile application that connects users with paramedics in real-time.

## Tech Stack

* Flutter
* Bloc (Cubit) for state management
* GetIt for dependency injection
* Dio for networking
* Clean Architecture (Data / Domain / Presentation)

## Features

* User emergency request system
* Paramedic dashboard & case handling
* Authentication (login, register, password reset)
* Request history
* Multi-language support (EN / AR)

## Project Structure

lib/

* core/ → shared logic (DI, navigation, theme, network)
* data/ → models, datasources, repository implementations
* domain/ → entities, repositories (contracts), use cases
* presentation/ → UI + Cubits
* shared/ → reusable widgets & helpers

## Run the project

flutter pub get
flutter run
