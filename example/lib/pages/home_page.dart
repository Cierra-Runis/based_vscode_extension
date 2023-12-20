import 'package:example_app/index.dart';

class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = L10N.maybeOf(context) ?? L10N.current;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.home),
      ),
    );
  }
}
