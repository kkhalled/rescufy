import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/domain/entities/case_status.dart';
import 'package:rescufy/presentation/paramedic/active_case/cubit/active_case_cubit.dart';
import 'package:rescufy/presentation/paramedic/active_case/cubit/active_case_state.dart';
import 'package:url_launcher/url_launcher.dart';

class ActiveCaseScreen extends StatefulWidget {
  const ActiveCaseScreen({super.key});

  @override
  State<ActiveCaseScreen> createState() => _ActiveCaseScreenState();
}

class _ActiveCaseScreenState extends State<ActiveCaseScreen> {
  bool _initialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_initialized) return;
    _initialized = true;
    context.read<ActiveCaseCubit>().initialize();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return BlocConsumer<ActiveCaseCubit, ActiveCaseState>(
      listenWhen: (prev, curr) =>
          prev.errorMessage != curr.errorMessage ||
          prev.caseStatus != curr.caseStatus,
      listener: (context, state) {
        if (state.errorMessage != null) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.errorMessage!)));
        }

        if (state.caseStatus == CaseStatus.completed) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Case completed successfully')),
          );
        }
      },
      builder: (context, state) {
        if (state.loadStatus == ActiveCaseLoadStatus.joining) {
          return _LoadingView(message: 'Joining live case updates...');
        }

        if (state.loadStatus == ActiveCaseLoadStatus.error) {
          return _ErrorView(
            message: state.errorMessage ?? 'Unable to join case',
          );
        }

        return Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => Navigator.of(context).maybePop(),
            ),
            title: Text('Active Case ${state.request.caseId}'),
          ),
          body: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  theme.colorScheme.primary.withValues(alpha: 0.08),
                  theme.scaffoldBackgroundColor,
                ],
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      padding: EdgeInsets.fromLTRB(20.w, 18.h, 20.w, 20.h),
                      child: Column(
                        children: [
                          _StatusBanner(state: state),
                          SizedBox(height: 14.h),
                          _PatientOverviewCard(state: state),
                          SizedBox(height: 14.h),
                          _LiveStatusCard(state: state),
                          SizedBox(height: 14.h),
                          _LocationCard(state: state),
                        ],
                      ),
                    ),
                  ),
                  _BottomActions(state: state),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _StatusBanner extends StatelessWidget {
  const _StatusBanner({required this.state});

  final ActiveCaseState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      child: Padding(
        padding: EdgeInsets.all(18.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Case Progress',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            SizedBox(height: 14.h),
            Wrap(
              spacing: 8.w,
              runSpacing: 8.h,
              children: CaseStatus.values
                  .map(
                    (status) => _StatusChip(
                      label: status.label,
                      isActive: status == state.caseStatus,
                      isCompleted:
                          CaseStatus.values.indexOf(status) <
                          CaseStatus.values.indexOf(state.caseStatus),
                    ),
                  )
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  const _StatusChip({
    required this.label,
    required this.isActive,
    required this.isCompleted,
  });

  final String label;
  final bool isActive;
  final bool isCompleted;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = isActive || isCompleted
        ? theme.colorScheme.primary
        : theme.textTheme.bodySmall?.color ?? AppColors.textSecondary;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
      decoration: BoxDecoration(
        color: (isActive || isCompleted) ? color.withValues(alpha: 0.1) : null,
        borderRadius: BorderRadius.circular(999.r),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Text(
        label,
        style: theme.textTheme.labelLarge?.copyWith(
          color: color,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _PatientOverviewCard extends StatelessWidget {
  const _PatientOverviewCard({required this.state});

  final ActiveCaseState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final request = state.request;

    return Card(
      child: Padding(
        padding: EdgeInsets.all(18.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Patient Information',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            SizedBox(height: 14.h),
            _DetailRow(label: 'Name', value: request.patientName),
            _DetailRow(label: 'Emergency', value: request.emergencyType),
            _DetailRow(
              label: 'Age / Gender',
              value: '${request.patientAge} • ${request.patientGender}',
            ),
            _DetailRow(label: 'Hospital', value: request.hospitalName),
            _DetailRow(
              label: 'Blood type',
              value: request.bloodType ?? 'Not available',
            ),
          ],
        ),
      ),
    );
  }
}

class _LiveStatusCard extends StatelessWidget {
  const _LiveStatusCard({required this.state});

  final ActiveCaseState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lastUpdated = state.lastUpdatedAt;

    return Card(
      child: Padding(
        padding: EdgeInsets.all(18.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.sync_outlined, color: AppColors.info, size: 20.sp),
                SizedBox(width: 8.w),
                Text(
                  'Live Status',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Spacer(),
                if (state.isUpdatingStatus)
                  SizedBox(
                    width: 18.w,
                    height: 18.w,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: theme.colorScheme.primary,
                    ),
                  ),
              ],
            ),
            SizedBox(height: 12.h),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(14.w),
              decoration: BoxDecoration(
                color: AppColors.info.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14.r),
              ),
              child: Text(
                state.liveStatusMessage ?? 'Waiting for live updates...',
                style: theme.textTheme.bodyMedium,
              ),
            ),
            SizedBox(height: 10.h),
            Text(
              lastUpdated == null
                  ? 'Update time not available yet'
                  : 'Last updated at ${_formatTime(lastUpdated)}',
              style: theme.textTheme.labelLarge?.copyWith(
                color: theme.textTheme.bodySmall?.color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final hour = dateTime.hour.toString().padLeft(2, '0');
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
}

class _LocationCard extends StatelessWidget {
  const _LocationCard({required this.state});

  final ActiveCaseState state;

  @override
  Widget build(BuildContext context) {
    final request = state.request;
    return Card(
      child: Padding(
        padding: EdgeInsets.all(18.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Location & Navigation',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
            ),
            SizedBox(height: 14.h),
            _DetailRow(label: 'Patient location', value: request.address),
            _DetailRow(
              label: 'Broadcasting',
              value: state.isTrackingLocation
                  ? 'Paramedic location is live'
                  : 'Waiting for device location',
            ),
            _DetailRow(
              label: 'Coordinates',
              value: state.paramedicLat != null && state.paramedicLng != null
                  ? '${state.paramedicLat!.toStringAsFixed(5)}, ${state.paramedicLng!.toStringAsFixed(5)}'
                  : 'Not available yet',
            ),
            SizedBox(height: 12.h),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _openMap(request.googleMapsUrl),
                icon: const Icon(Icons.map_outlined),
                label: const Text('Open Navigation'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _openMap(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}

class _BottomActions extends StatelessWidget {
  const _BottomActions({required this.state});

  final ActiveCaseState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(20.w, 14.h, 20.w, 24.h),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: switch (state.caseStatus) {
          CaseStatus.pending || CaseStatus.onTheWay => _PrimaryActionButton(
            label: 'Arrived',
            onPressed: state.isUpdatingStatus
                ? null
                : () => context.read<ActiveCaseCubit>().updateStatus(
                    CaseStatus.arrived,
                  ),
          ),
          CaseStatus.arrived => _PrimaryActionButton(
            label: 'Start Treatment',
            onPressed: state.isUpdatingStatus
                ? null
                : () => context.read<ActiveCaseCubit>().updateStatus(
                    CaseStatus.treatmentStarted,
                  ),
          ),
          CaseStatus.treatmentStarted => _PrimaryActionButton(
            label: 'Complete Case',
            onPressed: state.isUpdatingStatus
                ? null
                : () => context.read<ActiveCaseCubit>().updateStatus(
                    CaseStatus.completed,
                  ),
          ),
          CaseStatus.completed => OutlinedButton(
            onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(
              AppRoutes.paramedicShell,
              (route) => false,
            ),
            child: const Text('Back to Dashboard'),
          ),
        },
      ),
    );
  }
}

class _PrimaryActionButton extends StatelessWidget {
  const _PrimaryActionButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          minimumSize: Size(double.infinity, 54.h),
        ),
        child: Text(label),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(bottom: 12.h),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              label,
              style: theme.textTheme.labelLarge?.copyWith(
                color: theme.textTheme.bodySmall?.color,
              ),
            ),
          ),
          SizedBox(width: 12.w),
          Expanded(
            flex: 2,
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LoadingView extends StatelessWidget {
  const _LoadingView({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(
              color: Theme.of(context).colorScheme.primary,
            ),
            SizedBox(height: 16.h),
            Text(message, style: Theme.of(context).textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(24.w),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                color: theme.colorScheme.error,
                size: 48.sp,
              ),
              SizedBox(height: 14.h),
              Text(
                'Unable to open active case',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: 8.h),
              Text(
                message,
                style: theme.textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 18.h),
              OutlinedButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
