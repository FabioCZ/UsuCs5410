///<reference path="../../Scripts/typings/requirejs/require.d.ts" />
// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '.'
    }
});
// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);
//# sourceMappingURL=Loader.js.map