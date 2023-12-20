import 'package:example_app/index.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'package_info.g.dart';

@Riverpod(keepAlive: true)
PackageInfo packageInfo(PackageInfoRef ref) =>
    throw Exception('packageInfoProvider not initialized');

extension PackageInfoExt on PackageInfo {
  String get tagName => 'v$version+$buildNumber';
}
