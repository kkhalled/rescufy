import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/theme/colors.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  static const _cases = [
    (
      severity: 'CRITICAL',
      title: 'Cardiac Arrest',
      caseId: 'EMR-2410',
      date: 'Feb 16, 2026 - 14:35',
      responseTime: '18m 32s',
    ),
    (
      severity: 'HIGH',
      title: 'Severe Bleeding',
      caseId: 'EMR-2409',
      date: 'Feb 16, 2026 - 09:12',
      responseTime: '12m 45s',
    ),
    (
      severity: 'MEDIUM',
      title: 'Fractured Limb',
      caseId: 'EMR-2408',
      date: 'Feb 15, 2026 - 18:47',
      responseTime: '15m 20s',
    ),
    (
      severity: 'CRITICAL',
      title: 'Stroke Symptoms',
      caseId: 'EMR-2407',
      date: 'Feb 15, 2026 - 11:23',
      responseTime: '9m 18s',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Case History')),
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              theme.colorScheme.primary.withValues(alpha: 0.06),
              theme.scaffoldBackgroundColor,
            ],
          ),
        ),
        child: ListView.separated(
          padding: EdgeInsets.all(20.w),
          itemCount: _cases.length + 1,
          separatorBuilder: (_, _) => SizedBox(height: 14.h),
          itemBuilder: (context, index) {
            if (index == 0) {
              return _HistoryHeader(theme: theme);
            }

            final item = _cases[index - 1];
            return _HistoryCard(
              severity: item.severity,
              title: item.title,
              caseId: item.caseId,
              date: item.date,
              responseTime: item.responseTime,
            );
          },
        ),
      ),
    );
  }
}

class _HistoryHeader extends StatelessWidget {
  const _HistoryHeader({required this.theme});

  final ThemeData theme;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: 4.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Cases',
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: 6.h),
          Text(
            'Review recent emergency responses, severity level, and response time using the same app theme.',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.textTheme.bodySmall?.color,
            ),
          ),
        ],
      ),
    );
  }
}

class _HistoryCard extends StatelessWidget {
  const _HistoryCard({
    required this.severity,
    required this.title,
    required this.caseId,
    required this.date,
    required this.responseTime,
  });

  final String severity;
  final String title;
  final String caseId;
  final String date;
  final String responseTime;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final severityColor = switch (severity) {
      'CRITICAL' => theme.colorScheme.error,
      'HIGH' => AppColors.warning,
      _ => AppColors.info,
    };

    return Card(
      elevation: 2,
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 10.h),
            decoration: BoxDecoration(
              color: severityColor.withValues(alpha: 0.1),
              border: Border(left: BorderSide(color: severityColor, width: 4)),
            ),
            child: Row(
              children: [
                Text(
                  severity,
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: severityColor,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                  ),
                ),
                const Spacer(),
                Text(
                  caseId,
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: theme.textTheme.bodySmall?.color,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: EdgeInsets.all(16.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 12.h),
                Row(
                  children: [
                    Expanded(
                      child: _MetaItem(
                        icon: Icons.calendar_today_outlined,
                        label: 'Date',
                        value: date,
                      ),
                    ),
                    SizedBox(width: 12.w),
                    Expanded(
                      child: _MetaItem(
                        icon: Icons.timer_outlined,
                        label: 'Response',
                        value: responseTime,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MetaItem extends StatelessWidget {
  const _MetaItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18.sp, color: theme.colorScheme.primary),
          SizedBox(width: 10.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: theme.textTheme.bodySmall?.color,
                  ),
                ),
                SizedBox(height: 2.h),
                Text(
                  value,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
