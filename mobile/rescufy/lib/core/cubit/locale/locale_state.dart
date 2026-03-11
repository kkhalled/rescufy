// lib/core/cubit/locale/locale_state.dart
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class LocaleState extends Equatable {
  final Locale locale;

  const LocaleState({required this.locale});

  LocaleState copyWith({Locale? locale}) {
    return LocaleState(locale: locale ?? this.locale);
  }

  @override
  List<Object?> get props => [locale];
}
