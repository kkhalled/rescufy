import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/navigation/app_routes.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_cubit.dart';
import 'package:rescufy/presentation/paramedic/incoming_request/cubit/incoming_request_state.dart';

class IncomingRequestScreen extends StatelessWidget {
  const IncomingRequestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final request = context.select(
      (IncomingRequestCubit cubit) => cubit.state.request,
    );

    return BlocConsumer<IncomingRequestCubit, IncomingRequestState>(
      listenWhen: (prev, curr) => prev.status != curr.status,
      listener: (context, state) {
        if (state.status == IncomingRequestStatus.refused ||
            state.status == IncomingRequestStatus.cancelled) {
          Navigator.of(
            context,
          ).pushNamedAndRemoveUntil(AppRoutes.paramedicShell, (route) => false);
        }

        if (state.status == IncomingRequestStatus.accepted) {
          Navigator.of(context).pushReplacementNamed(
            AppRoutes.paramedicActiveCase,
            arguments: state.request,
          );
        }

        if (state.status == IncomingRequestStatus.error &&
            state.errorMessage != null) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.errorMessage!)));
        }
      },
      builder: (context, state) {
        final isBusy =
            state.status == IncomingRequestStatus.accepting ||
            state.status == IncomingRequestStatus.refusing;

        return Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(
                AppRoutes.paramedicShell,
                (route) => false,
              ),
            ),
            title: const Text('Incoming Request'),
          ),
          body: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  theme.colorScheme.primary.withValues(alpha: 0.1),
                  theme.scaffoldBackgroundColor,
                ],
              ),
            ),
            child: SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.fromLTRB(18.w, 18.h, 18.w, 24.h),
                child: Center(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: 560.w),
                    child: Column(
                      children: [
                        Card(
                          elevation: 6,
                          child: Padding(
                            padding: EdgeInsets.all(20.w),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _HeaderSection(request: request),
                                SizedBox(height: 18.h),
                                _CountdownBanner(createdAt: request.createdAt),
                                SizedBox(height: 18.h),
                                _SectionCard(
                                  title: 'Patient',
                                  icon: Icons.person_outline,
                                  accentColor: theme.colorScheme.primary,
                                  child: Column(
                                    children: [
                                      _InfoRow(
                                        label: 'Name',
                                        value: request.patientName,
                                      ),
                                      _InfoRow(
                                        label: 'Emergency',
                                        value: request.emergencyType,
                                      ),
                                      _InfoRow(
                                        label: 'Age / Gender',
                                        value:
                                            '${request.patientAge} • ${request.patientGender}',
                                      ),
                                      _InfoRow(
                                        label: 'Description',
                                        value: request.description,
                                        multiline: true,
                                      ),
                                    ],
                                  ),
                                ),
                                SizedBox(height: 14.h),
                                _SectionCard(
                                  title: 'Location',
                                  icon: Icons.location_on_outlined,
                                  accentColor: AppColors.info,
                                  child: Column(
                                    children: [
                                      _InfoRow(
                                        label: 'Address',
                                        value: request.address,
                                        multiline: true,
                                      ),
                                      _InfoRow(
                                        label: 'Distance',
                                        value:
                                            '${_mockDistanceKm(request).toStringAsFixed(1)} km away',
                                      ),
                                      _InfoRow(
                                        label: 'Assigned hospital',
                                        value: request.hospitalName,
                                      ),
                                    ],
                                  ),
                                ),
                                if (request.aiSummary != null ||
                                    request.hasCriticalMedicalData) ...[
                                  SizedBox(height: 14.h),
                                  _SectionCard(
                                    title: 'Clinical Snapshot',
                                    icon: Icons.monitor_heart_outlined,
                                    accentColor: AppColors.warning,
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        if (request.aiSummary != null) ...[
                                          Text(
                                            request.aiSummary!,
                                            style: theme.textTheme.bodyMedium,
                                          ),
                                          SizedBox(height: 12.h),
                                        ],
                                        if (request.allergies.isNotEmpty)
                                          _ChipWrap(
                                            label: 'Allergies',
                                            items: request.allergies,
                                            color: AppColors.error,
                                          ),
                                        if (request.chronicDiseases.isNotEmpty)
                                          _ChipWrap(
                                            label: 'Chronic diseases',
                                            items: request.chronicDiseases,
                                            color: AppColors.warning,
                                          ),
                                        if (request
                                            .currentMedications
                                            .isNotEmpty)
                                          _ChipWrap(
                                            label: 'Current medications',
                                            items: request.currentMedications,
                                            color: AppColors.info,
                                          ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                        SizedBox(height: 14.h),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: isBusy
                                    ? null
                                    : () => context
                                          .read<IncomingRequestCubit>()
                                          .refuseRequest(
                                            'Assignment rejected by paramedic',
                                          ),
                                style: OutlinedButton.styleFrom(
                                  minimumSize: Size(double.infinity, 54.h),
                                  side: BorderSide(
                                    color: theme.colorScheme.error,
                                  ),
                                  foregroundColor: theme.colorScheme.error,
                                ),
                                child:
                                    state.status ==
                                        IncomingRequestStatus.refusing
                                    ? SizedBox(
                                        width: 20.w,
                                        height: 20.w,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          color: theme.colorScheme.error,
                                        ),
                                      )
                                    : const Text('Reject'),
                              ),
                            ),
                            SizedBox(width: 12.w),
                            Expanded(
                              flex: 2,
                              child: ElevatedButton(
                                onPressed: isBusy
                                    ? null
                                    : context
                                          .read<IncomingRequestCubit>()
                                          .acceptRequest,
                                style: ElevatedButton.styleFrom(
                                  minimumSize: Size(double.infinity, 54.h),
                                ),
                                child:
                                    state.status ==
                                        IncomingRequestStatus.accepting
                                    ? SizedBox(
                                        width: 20.w,
                                        height: 20.w,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          color: theme.colorScheme.onPrimary,
                                        ),
                                      )
                                    : const Text('Accept Request'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  double _mockDistanceKm(IncomingRequest request) {
    final seed = request.requestId.codeUnits.fold<int>(
      0,
      (value, item) => value + item,
    );
    return 1.2 + (seed % 60) / 10;
  }
}

class _HeaderSection extends StatelessWidget {
  const _HeaderSection({required this.request});

  final IncomingRequest request;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final severityColor = request.isCritical
        ? theme.colorScheme.error
        : AppColors.warning;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
              decoration: BoxDecoration(
                color: severityColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(999.r),
              ),
              child: Text(
                request.severity.toUpperCase(),
                style: theme.textTheme.labelLarge?.copyWith(
                  color: severityColor,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            const Spacer(),
            Text(
              request.caseId,
              style: theme.textTheme.labelLarge?.copyWith(
                color: theme.textTheme.bodySmall?.color,
              ),
            ),
          ],
        ),
        SizedBox(height: 14.h),
        Text(
          'Incoming Emergency Request',
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ),
        SizedBox(height: 6.h),
        Text(
          'A new case is ready for review. Accept to begin the active response workflow.',
          style: theme.textTheme.bodyMedium,
        ),
      ],
    );
  }
}

class _CountdownBanner extends StatelessWidget {
  const _CountdownBanner({required this.createdAt});

  final DateTime createdAt;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final elapsed = DateTime.now().difference(createdAt).inMinutes;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        color: AppColors.info.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: AppColors.info.withValues(alpha: 0.14)),
      ),
      child: Row(
        children: [
          Icon(Icons.schedule, color: AppColors.info, size: 18.sp),
          SizedBox(width: 10.w),
          Expanded(
            child: Text(
              'Reported ${max(elapsed, 0)} minute${elapsed == 1 ? '' : 's'} ago',
              style: theme.textTheme.labelLarge?.copyWith(
                color: AppColors.info,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.icon,
    required this.accentColor,
    required this.child,
  });

  final String title;
  final IconData icon;
  final Color accentColor;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: accentColor.withValues(alpha: 0.12)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(10.w),
                decoration: BoxDecoration(
                  color: accentColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12.r),
                ),
                child: Icon(icon, size: 18.sp, color: accentColor),
              ),
              SizedBox(width: 10.w),
              Text(
                title,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          SizedBox(height: 14.h),
          child,
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.label,
    required this.value,
    this.multiline = false,
  });

  final String label;
  final String value;
  final bool multiline;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final secondaryColor = theme.textTheme.bodySmall?.color;

    return Padding(
      padding: EdgeInsets.only(bottom: 12.h),
      child: multiline
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: secondaryColor,
                  ),
                ),
                SizedBox(height: 4.h),
                Text(value, style: theme.textTheme.bodyMedium),
              ],
            )
          : Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    label,
                    style: theme.textTheme.labelLarge?.copyWith(
                      color: secondaryColor,
                    ),
                  ),
                ),
                SizedBox(width: 16.w),
                Expanded(
                  flex: 2,
                  child: Text(
                    value,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                    textAlign: TextAlign.end,
                  ),
                ),
              ],
            ),
    );
  }
}

class _ChipWrap extends StatelessWidget {
  const _ChipWrap({
    required this.label,
    required this.items,
    required this.color,
  });

  final String label;
  final List<String> items;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(bottom: 12.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: theme.textTheme.labelLarge?.copyWith(
              color: theme.textTheme.bodySmall?.color,
            ),
          ),
          SizedBox(height: 8.h),
          Wrap(
            spacing: 8.w,
            runSpacing: 8.h,
            children: items
                .map(
                  (item) => Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: 10.w,
                      vertical: 8.h,
                    ),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(999.r),
                    ),
                    child: Text(
                      item,
                      style: theme.textTheme.labelLarge?.copyWith(
                        color: color,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}
