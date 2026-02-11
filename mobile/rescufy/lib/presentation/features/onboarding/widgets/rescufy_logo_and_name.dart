import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rescufy/core/theme/colors.dart';
import 'package:rescufy/core/theme/text_styles.dart';

class RescufyLogoAndName extends StatelessWidget {
  const RescufyLogoAndName({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SvgPicture.asset('assets/svgs/logo3.svg', height: 50.h, width: 50.w),
        SizedBox(width: 10.w),
        Text('Rescufy', style: AppTextStyles.displayMedium),
      ],
    );
  }
}
