import {init, plugins, setters} from '@alilc/lowcode-engine';
import PluginX6Designer from '@alilc/lce-graph-x6-designer';
import PluginMaterialsPane from '@alilc/lce-graph-materials-pane';
import PluginCore from '@alilc/lce-graph-core';
import {RemoveItemPlugin, UndoRedoPlugin, ZoomPlugin} from '@alilc/lce-graph-tools';
import PluginX6DesignerExtension from './plugins/x6-designer-extension';
import assets from './services/assets.json';
import './global.scss';
import PluginSchemaLoader from "./plugins/schema-loader-extension";
import pluginDefaultSettersRegistry from "./plugins/plugin-default-setters-registry";
import ClazzSetter from "./setters/clazz-setter";
import MethodSetter from "./setters/method-setter";
import ParamSetter from "./setters/param-setter";

(async function main() {
    setters.registerSetter('ClazzSetter', ClazzSetter);
    setters.registerSetter('MethodSetter', MethodSetter);
    setters.registerSetter('ParamSetter', ParamSetter);
    await plugins.register(PluginCore, {
        assets,
        //schema
    });
    await plugins.register(PluginX6Designer);
    await plugins.register(pluginDefaultSettersRegistry);
    await plugins.register(PluginMaterialsPane);
    await plugins.register(PluginX6DesignerExtension);
    //await plugins.register(logo);
    await plugins.register(RemoveItemPlugin);
    // await plugins.register(OperateButtonPlugin, [
    //   {
    //     callback: (schema: any) => {
    //       saveSchema(schema);
    //     },
    //     name: 'save',
    //     text: '保存',
    //     hotkey: 'command+s',
    //   },
    //   {
    //     callback: (schema: any) => {
    //       console.log('发布回调', schema)
    //     },
    //     name: 'publish',
    //     text: '发布',
    //     hotkey: 'command+p',
    //   },
    //   {
    //     callback: async (schema: any) => {
    //       console.log('自定义操作按钮回调', schema)
    //       const result = await CodeGenerator.generateCode({
    //         solution: 'rax', // 出码方案 (目前内置有 icejs、icejs3 和 rax )
    //         schema, // 编排搭建出来的 schema
    //       });
    //       console.log(result);
    //     },
    //     name: 'test',
    //     text: '测试自定义按钮',
    //     hotkey: 'command+0',
    //     btnProps: { type: 'secondary' },
    //   },
    //   {
    //     callback: () => {
    //       resetSchema('test');
    //     },
    //     name: 'reset',
    //     text: '重置'
    //   },
    // ]);
    await plugins.register(UndoRedoPlugin);
    await plugins.register(ZoomPlugin);
    await plugins.register(PluginSchemaLoader);
    await init();
})();
