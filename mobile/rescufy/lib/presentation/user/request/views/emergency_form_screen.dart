import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/core/theme/app_text_styles.dart';

class EmergencyFormScreen extends StatefulWidget {
  final bool isSelfCase;

  // Location state (passed from wrapper)
  final bool isLocationLoading;
  final bool hasLocationError;
  final String? locationErrorMessage;
  final String? address;
  final double? latitude;
  final double? longitude;

  // Submit state (passed from wrapper)
  final bool isSubmitting;

  // Callbacks (to wrapper)
  final VoidCallback onRefreshLocation;
  final Function(String description, String? peopleCount) onSubmit;

  const EmergencyFormScreen({
    super.key,
    required this.isSelfCase,
    required this.isLocationLoading,
    required this.hasLocationError,
    this.locationErrorMessage,
    this.address,
    this.latitude,
    this.longitude,
    required this.isSubmitting,
    required this.onRefreshLocation,
    required this.onSubmit,
  });

  @override
  State<EmergencyFormScreen> createState() => _EmergencyFormScreenState();
}

class _EmergencyFormScreenState extends State<EmergencyFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  final _peopleCountController = TextEditingController();
  final _ageController = TextEditingController();
  final _medicalConditionsController = TextEditingController();

  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark
        ? AppColorsDark.textPrimary
        : AppColors.textPrimary;
    final secondaryTextColor = isDark
        ? AppColorsDark.textSecondary
        : AppColors.textSecondary;

    return Scaffold(
      backgroundColor: isDark ? AppColorsDark.background : AppColors.background,
      body: CustomScrollView(
        slivers: [
          _buildAppBar(),
          SliverToBoxAdapter(
            child: Form(
              key: _formKey,
              child: Padding(
                padding: EdgeInsets.all(20.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildTypeBadge(isDark, textColor),
                    SizedBox(height: 24.h),
                    _buildDescriptionField(isDark, textColor),
                    SizedBox(height: 24.h),
                    _buildLocationSection(
                      isDark,
                      textColor,
                      secondaryTextColor,
                    ),
                    SizedBox(height: 24.h),
                    _buildAdditionalInfo(isDark, textColor),
                    SizedBox(height: 32.h),
                    _buildSubmitButton(),
                    SizedBox(height: 20.h),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 140.h,
      floating: false,
      pinned: true,
      backgroundColor: widget.isSelfCase ? AppColors.error : AppColors.info,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          widget.isSelfCase ? 'Request Ambulance' : 'Report Emergency',
          style: AppTextStyles.headlineMedium(
            Colors.white,
          ).copyWith(fontWeight: FontWeight.bold),
        ),
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: widget.isSelfCase
                  ? [AppColors.error, AppColors.error.withOpacity(0.8)]
                  : [AppColors.info, AppColors.info.withOpacity(0.8)],
            ),
          ),
          child: Align(
            alignment: Alignment.bottomLeft,
            child: Padding(
              padding: EdgeInsets.only(left: 16.w, bottom: 60.h),
              child: Icon(
                widget.isSelfCase ? Icons.personal_injury : Icons.people,
                size: 80.sp,
                color: Colors.white.withOpacity(0.2),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTypeBadge(bool isDark, Color textColor) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
      decoration: BoxDecoration(
        color: widget.isSelfCase
            ? AppColors.error.withOpacity(0.1)
            : AppColors.info.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(
          color: widget.isSelfCase
              ? AppColors.error.withOpacity(0.3)
              : AppColors.info.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            widget.isSelfCase ? Icons.person : Icons.people,
            color: widget.isSelfCase ? AppColors.error : AppColors.info,
            size: 20.sp,
          ),
          SizedBox(width: 8.w),
          Text(
            widget.isSelfCase ? 'Personal Emergency' : 'Reporting for Others',
            style: AppTextStyles.labelLarge(
              widget.isSelfCase ? AppColors.error : AppColors.info,
            ).copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildDescriptionField(bool isDark, Color textColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.description, color: AppColors.primary, size: 20.sp),
            SizedBox(width: 8.w),
            Text(
              'Describe the Emergency *',
              style: AppTextStyles.bodyLarge(
                textColor,
              ).copyWith(fontWeight: FontWeight.w600),
            ),
          ],
        ),
        SizedBox(height: 12.h),
        Container(
          decoration: BoxDecoration(
            color: isDark ? AppColorsDark.surface : Colors.white,
            borderRadius: BorderRadius.circular(12.r),
            border: Border.all(
              color: isDark ? AppColorsDark.border : AppColors.border,
            ),
          ),
          child: TextFormField(
            controller: _descriptionController,
            maxLines: 6,
            style: AppTextStyles.bodyMedium(textColor),
            decoration: InputDecoration(
              hintText:
                  'Please provide details:\n'
                  '• What happened?\n'
                  '• Number of people involved\n'
                  '• Visible injuries\n'
                  '• Any immediate dangers',
              hintStyle: AppTextStyles.bodySmall(
                isDark ? AppColorsDark.textSecondary : AppColors.textDisabled,
              ),
              border: InputBorder.none,
              contentPadding: EdgeInsets.all(16.w),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please describe the emergency';
              }
              return null;
            },
          ),
        ),
      ],
    );
  }

  Widget _buildLocationSection(
    bool isDark,
    Color textColor,
    Color secondaryTextColor,
  ) {
    String statusText = 'Detecting location...';
    String? detailText;
    Color statusColor = textColor;

    if (widget.hasLocationError) {
      statusText = 'Location Error';
      detailText = widget.locationErrorMessage;
      statusColor = AppColors.error;
    } else if (!widget.isLocationLoading && widget.address != null) {
      statusText = 'Location Detected';
      detailText = widget.address;
    }

    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: isDark ? AppColorsDark.surface : Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(10.w),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10.r),
                ),
                child: Icon(
                  Icons.location_on,
                  color: AppColors.primary,
                  size: 24.sp,
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      statusText,
                      style: AppTextStyles.bodyLarge(
                        statusColor,
                      ).copyWith(fontWeight: FontWeight.w600),
                    ),
                    if (detailText != null) ...[
                      SizedBox(height: 4.h),
                      Text(
                        detailText,
                        style: AppTextStyles.bodySmall(
                          widget.hasLocationError
                              ? AppColors.error
                              : secondaryTextColor,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (!widget.isLocationLoading)
                IconButton(
                  icon: Icon(
                    Icons.refresh,
                    color: widget.hasLocationError
                        ? AppColors.error
                        : AppColors.primary,
                  ),
                  onPressed: widget.onRefreshLocation,
                  tooltip: 'Refresh location',
                ),
              if (widget.isLocationLoading)
                SizedBox(
                  width: 20.w,
                  height: 20.h,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.primary,
                  ),
                ),
            ],
          ),
          if (widget.latitude != null && widget.longitude != null) ...[
            SizedBox(height: 12.h),
            Container(
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(
                color: isDark ? AppColorsDark.background : AppColors.background,
                borderRadius: BorderRadius.circular(12.r),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.my_location,
                    size: 16.sp,
                    color: secondaryTextColor,
                  ),
                  SizedBox(width: 8.w),
                  Expanded(
                    child: Text(
                      'Lat: ${widget.latitude!.toStringAsFixed(6)}, Long: ${widget.longitude!.toStringAsFixed(6)}',
                      style: AppTextStyles.bodySmall(secondaryTextColor),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildAdditionalInfo(bool isDark, Color textColor) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColorsDark.surface : Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(
          color: isDark ? AppColorsDark.border : AppColors.border,
        ),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 4.h),
          title: Row(
            children: [
              Icon(
                Icons.add_circle_outline,
                color: AppColors.primary,
                size: 20.sp,
              ),
              SizedBox(width: 8.w),
              Text(
                'Additional Information (Optional)',
                style: AppTextStyles.bodyLarge(
                  textColor,
                ).copyWith(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          onExpansionChanged: (expanded) {
            setState(() => _isExpanded = expanded);
          },
          children: [
            Padding(
              padding: EdgeInsets.fromLTRB(16.w, 0, 16.w, 16.h),
              child: Column(
                children: [
                  _buildTextField(
                    controller: _peopleCountController,
                    label: 'Number of people affected',
                    icon: Icons.group,
                    keyboardType: TextInputType.number,
                    isDark: isDark,
                    textColor: textColor,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
    required bool isDark,
    required Color textColor,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      style: AppTextStyles.bodyMedium(textColor),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: AppTextStyles.bodyMedium(
          isDark ? AppColorsDark.textSecondary : AppColors.textSecondary,
        ),
        prefixIcon: Icon(icon, color: AppColors.primary, size: 20.sp),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: BorderSide(
            color: isDark ? AppColorsDark.border : AppColors.border,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: BorderSide(
            color: isDark ? AppColorsDark.border : AppColors.border,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
      ),
    );
  }

  Widget _buildSubmitButton() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.error, AppColors.primary],
        ),
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: AppColors.error.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: widget.isSubmitting ? null : _handleSubmit,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          minimumSize: Size(double.infinity, 60.h),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.r),
          ),
        ),
        child: widget.isSubmitting
            ? SizedBox(
                width: 24.w,
                height: 24.h,
                child: const CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.send, color: Colors.white, size: 24),
                  SizedBox(width: 12.w),
                  Text(
                    'SEND EMERGENCY REQUEST',
                    style: AppTextStyles.buttonLarge.copyWith(
                      fontSize: 16.sp,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  void _handleSubmit() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    widget.onSubmit(_descriptionController.text, _peopleCountController.text);
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _peopleCountController.dispose();
    super.dispose();
  }
}
