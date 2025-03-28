import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';


// Name of Index DB
const fileCache = localForage.createInstance({
  name: 'filecache'
});
 
export const fetchPlugin = (input:string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

        // Handle Root Entry Index.js
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
            loader: 'jsx',
            contents: input,
          };
      });

      build.onLoad({ filter: /.*/ }, async(args) => {
        const cachedValue = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        if (cachedValue) {
          return cachedValue;
        }
      });

      build.onLoad({ filter: /.css$/ }, async(args) => {
        // Check if we made request to the file,
        // If yes then return immeadiatly 
          const { data, request } = await axios(args.path);

          const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")

          const contents = 
          `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          ` 
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents,
            resolveDir: new URL('./', request.responseURL).pathname
          };
          // store in cache
          await fileCache.setItem(args.path, result);
          return result;
        
      });
      
      build.onLoad({ filter: /.*/ }, async (args: any) => {

          const { data, request } = await axios(args.path);
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: data,
            resolveDir: new URL('./', request.responseURL).pathname
          };
          // store in cache
          await fileCache.setItem(args.path, result);
          return result;
      });
    },
  };
};