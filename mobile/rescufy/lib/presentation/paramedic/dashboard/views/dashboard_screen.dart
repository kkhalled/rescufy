import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/presentation/paramedic/dashboard/cubit/dashboard_cubit.dart';
import 'package:rescufy/presentation/paramedic/dashboard/cubit/dashboard_state.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _initialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_initialized) return;
    _initialized = true;
    context.read<DashboardCubit>().initialize();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return BlocConsumer<DashboardCubit, DashboardState>(
      listenWhen: (prev, curr) =>
          curr.incomingRequest != null &&
          curr.incomingRequest != prev.incomingRequest,
      listener: (context, state) async {
        final request = state.incomingRequest;
        if (request == null) return;

        await Navigator.of(
          context,
        ).pushNamed(AppRoutes.paramedicIncomingRequest, arguments: request);

        if (context.mounted) {
          context.read<DashboardCubit>().clearIncomingRequest();
        }
      },
      builder: (context, state) {
        return Scaffold(
          body: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  colorScheme.primary.withValues(alpha: 0.08),
                  theme.scaffoldBackgroundColor,
                ],
              ),
            ),
            child: SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.fromLTRB(20.w, 20.h, 20.w, 24.h),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Paramedic Dashboard',
                      style: theme.textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    SizedBox(height: 6.h),
                    Text(
                      'Stay available for real-time emergency dispatches and follow the live case flow from one place.',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.textTheme.bodySmall?.color,
                      ),
                    ),
                    SizedBox(height: 20.h),
                    _StatusHero(
                      isOnline: state.isOnline,
                      signalRStatus: state.signalRStatus,
                      onToggleAvailability: context
                          .read<DashboardCubit>()
                          .toggleAvailability,
                    ),
                    SizedBox(height: 18.h),
                    if (state.error != null) ...[
                      _InlineMessage(
                        icon: Icons.error_outline,
                        color: colorScheme.error,
                        message: state.error!,
                      ),
                      SizedBox(height: 18.h),
                    ],
                    _OverviewCard(
                      title: 'Dispatch Monitoring',
                      subtitle: state.isOnline
                          ? 'Listening for incoming emergency requests through the mock real-time hub.'
                          : 'Go online to start receiving emergency requests.',
                      icon: Icons.wifi_tethering,
                      accentColor: AppColors.info,
                    ),
                    SizedBox(height: 14.h),
                    _OverviewCard(
                      title: 'Current Workflow',
                      subtitle:
                          'Dashboard receives the request, incoming view handles accept or reject, and active case manages live treatment progress.',
                      icon: Icons.alt_route,
                      accentColor: colorScheme.primary,
                    ),
                    SizedBox(height: 14.h),
                    _WaitingCard(
                      signalRStatus: state.signalRStatus,
                      isOnline: state.isOnline,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _StatusHero extends StatelessWidget {
  const _StatusHero({
    required this.isOnline,
    required this.signalRStatus,
    required this.onToggleAvailability,
  });

  final bool isOnline;
  final DashboardSignalRStatus signalRStatus;
  final VoidCallback onToggleAvailability;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final availabilityColor = isOnline ? AppColors.success : AppColors.warning;

    return Card(
      child: Padding(
        padding: EdgeInsets.all(18.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 12.w,
                  height: 12.w,
                  decoration: BoxDecoration(
                    color: availabilityColor,
                    shape: BoxShape.circle,
                  ),
                ),
                SizedBox(width: 10.w),
                Expanded(
                  child: Text(
                    isOnline ? 'You are online' : 'You are offline',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Switch(
                  value: isOnline,
                  onChanged: (_) => onToggleAvailability(),
                  activeThumbColor: colorScheme.primary,
                ),
              ],
            ),
            SizedBox(height: 12.h),
            Text(
              isOnline
                  ? 'Real-time dispatch is enabled. New requests will open immediately when the mock service emits them.'
                  : 'Enable availability to simulate the full dispatch flow from dashboard to active case.',
              style: theme.textTheme.bodyMedium,
            ),
            SizedBox(height: 14.h),
            _ConnectionPill(status: signalRStatus),
          ],
        ),
      ),
    );
  }
}

class _ConnectionPill extends StatelessWidget {
  const _ConnectionPill({required this.status});

  final DashboardSignalRStatus status;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final (label, color) = switch (status) {
      DashboardSignalRStatus.connected => ('Connected', AppColors.success),
      DashboardSignalRStatus.connecting => ('Connecting', AppColors.warning),
      DashboardSignalRStatus.reconnecting => (
        'Reconnecting',
        AppColors.warning,
      ),
      DashboardSignalRStatus.disconnected => ('Disconnected', AppColors.error),
    };

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: color.withValues(alpha: 0.18)),
      ),
      child: Row(
        children: [
          Icon(Icons.hub, color: color, size: 18.sp),
          SizedBox(width: 8.w),
          Text(
            'SignalR $label',
            style: theme.textTheme.labelLarge?.copyWith(
              color: color,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _OverviewCard extends StatelessWidget {
  const _OverviewCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.accentColor,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color accentColor;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      child: Padding(
        padding: EdgeInsets.all(18.w),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(
                color: accentColor.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14.r),
              ),
              child: Icon(icon, color: accentColor, size: 22.sp),
            ),
            SizedBox(width: 14.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  SizedBox(height: 6.h),
                  Text(subtitle, style: theme.textTheme.bodyMedium),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _WaitingCard extends StatelessWidget {
  const _WaitingCard({required this.signalRStatus, required this.isOnline});

  final DashboardSignalRStatus signalRStatus;
  final bool isOnline;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final iconColor = isOnline ? colorScheme.primary : AppColors.warning;

    return Card(
      child: Padding(
        padding: EdgeInsets.all(24.w),
        child: Column(
          children: [
            Icon(Icons.local_hospital_outlined, size: 48.sp, color: iconColor),
            SizedBox(height: 14.h),
            Text(
              'Waiting for emergency requests',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 8.h),
            Text(
              signalRStatus == DashboardSignalRStatus.connected
                  ? 'The mock SignalR service will emit a request automatically after a short interval.'
                  : 'The dashboard will begin listening as soon as the connection is active.',
              style: theme.textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _InlineMessage extends StatelessWidget {
  const _InlineMessage({
    required this.icon,
    required this.color,
    required this.message,
  });

  final IconData icon;
  final Color color;
  final String message;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: color.withValues(alpha: 0.18)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 18.sp),
          SizedBox(width: 10.w),
          Expanded(
            child: Text(
              message,
              style: theme.textTheme.bodyMedium?.copyWith(color: color),
            ),
          ),
        ],
      ),
    );
  }
}
