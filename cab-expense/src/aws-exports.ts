/**
 * Amplify configuration outputs.
 *
 * In most Amplify projects this is generated as `src/aws-exports.js` by:
 * - `amplify pull`
 * - `amplify push`
 *
 * This repo snapshot didn’t include it, so we:
 * - try to load the generated JS file at runtime if it exists
 * - fall back to an empty object (app will run but Amplify won’t connect)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let awsExports: any = {};

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const loaded = require('./aws-exports.js');
  awsExports = loaded?.default ?? loaded;
} catch (_e) {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Amplify] Missing `src/aws-exports.js`. Run `amplify pull` inside the Expo project to generate it.',
    );
  }
}

export default awsExports;

