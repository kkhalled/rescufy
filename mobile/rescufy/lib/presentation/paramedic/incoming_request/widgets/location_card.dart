import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rescufy/domain/entities/incoming_request.dart';
import 'package:url_launcher/url_launcher.dart';

class LocationCard extends StatelessWidget {
  const LocationCard({super.key, required this.request});
  final IncomingRequest request;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1F2E),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: const Color(0xFF2A3142)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(8.w),
                decoration: BoxDecoration(
                  color: const Color(0xFF00D9A5).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8.r),
                ),
                child: Icon(
                  Icons.location_on,
                  color: const Color(0xFF00D9A5),
                  size: 18.sp,
                ),
              ),
              SizedBox(width: 10.w),
              Text(
                'Patient Location',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          SizedBox(height: 12.h),
          Text(
            request.address,
            style: TextStyle(color: Colors.white70, fontSize: 13.sp),
          ),
          SizedBox(height: 6.h),
          Text(
            '${request.latitude.toStringAsFixed(6)},  ${request.longitude.toStringAsFixed(6)}',
            style: TextStyle(
              color: Colors.white38,
              fontSize: 11.sp,
              fontFamily: 'monospace',
            ),
          ),
          SizedBox(height: 14.h),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _openMaps(request.googleMapsUrl),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00D9A5),
                padding: EdgeInsets.symmetric(vertical: 14.h),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.r),
                ),
              ),
              icon: Icon(Icons.map, color: Colors.white, size: 18.sp),
              label: Text(
                'Open in Google Maps',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _openMaps(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
