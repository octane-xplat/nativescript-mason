import assert from 'node:assert/strict';

// Adapt only the generated project. Physical XCTest needs an application host;
// the normal simulator suite remains tool-hosted. No demo widgets are included.
export function projectIosDeviceTestHost(project) {
  function edit(id, transform) {
    const pattern = new RegExp(`(^\\t\\t${id} /\\*[^\\n]*\\*/ = \\{[\\s\\S]*?^\\t\\t\\};)`, 'm');
    assert.match(project, pattern, `Missing device test project object ${id}`);
    project = project.replace(pattern, transform);
  }
  edit('F18483A92935351200EC35F4', (block) => block
    .replace(/buildPhases = \([\s\S]*?\);/, 'buildPhases = (F18483A62935351200EC35F4 /* Sources */,);')
    .replace(/dependencies = \([\s\S]*?\);/, 'dependencies = ();'));
  edit('F1848395293534D800EC35F4', (block) => block.replace('dependencies = (', 'dependencies = (\n                F18483C12935351300EC35F4 /* PBXTargetDependency */,'));
  for (const id of ['F18483D22935351300EC35F4', 'F18483D32935351300EC35F4']) {
    edit(id, (block) => block.replace(/buildSettings = \{[\s\S]*?\n\t\t\t\};/, `buildSettings = {
                PRODUCT_BUNDLE_IDENTIFIER = org.octanexplat.mason.smoothcorners.host;
                PRODUCT_NAME = "$(TARGET_NAME)";
                GENERATE_INFOPLIST_FILE = YES;
                INFOPLIST_KEY_CFBundleDisplayName = "Mason corner tests";
                INFOPLIST_KEY_UILaunchScreen_Generation = YES;
                INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
                IPHONEOS_DEPLOYMENT_TARGET = 15.6;
                CODE_SIGN_STYLE = Automatic;
                CURRENT_PROJECT_VERSION = 1;
                MARKETING_VERSION = 1.0;
                SWIFT_VERSION = 5.0;
                TARGETED_DEVICE_FAMILY = "1,2";
            };`));
  }
  return project;
}

export const iosDeviceTestApp = `import UIKit
@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication, configurationForConnecting session: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(name: nil, sessionRole: session.role)
    configuration.delegateClass = SceneDelegate.self
    return configuration
  }
}
final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
    guard let scene = scene as? UIWindowScene else { return }
    let window = UIWindow(windowScene: scene)
    window.rootViewController = UIViewController()
    window.makeKeyAndVisible()
    self.window = window
  }
}
`;
