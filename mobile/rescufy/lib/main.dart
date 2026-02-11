// lib/main.dart
import 'package:flutter/material.dart';

import 'package:rescufy/core/di/injection_container.dart' as di;

import 'package:rescufy/rescufy_app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize dependency injection
  await di.init();

  runApp(const RescufyApp());
}
