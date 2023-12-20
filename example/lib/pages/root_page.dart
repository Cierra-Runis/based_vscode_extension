import 'package:example_app/index.dart';

class RootPage extends StatelessWidget {
  const RootPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const BasedSplitView(
      leftWidget: _LeftWidget(),
    );
  }
}

class _LeftWidget extends StatefulWidget {
  const _LeftWidget();

  @override
  State<_LeftWidget> createState() => _LeftWidgetState();
}

class _LeftWidgetState extends State<_LeftWidget> {
  int _currentIndex = 0;

  void _onItemTapped(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10N.maybeOf(context) ?? L10N.current;

    final destinationModel = _NavigationDestinationModel(
      destinations: [
        NavigationDestination(
          icon: const Icon(Icons.home_rounded),
          label: l10n.home,
        ),
        NavigationDestination(
          icon: const Icon(Icons.settings_rounded),
          label: l10n.settings,
        ),
      ],
      bodies: [
        const HomePage(key: ValueKey(HomePage)),
        const SettingsPage(key: ValueKey(SettingsPage)),
      ],
    );

    return Scaffold(
      body: Center(
        child: AnimatedSwitcher(
          duration: Durations.medium2,
          child: destinationModel.bodies[_currentIndex],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _onItemTapped,
        destinations: destinationModel.destinations,
      ),
    );
  }
}

class _NavigationDestinationModel {
  const _NavigationDestinationModel({
    required this.destinations,
    required this.bodies,
  });
  final List<NavigationDestination> destinations;
  final List<Widget> bodies;
}
