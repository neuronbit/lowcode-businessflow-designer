import {IPublicEnumTransformStage, IPublicModelPluginContext} from '@alilc/lowcode-types';
import {event} from "@alilc/lowcode-engine";
import {debounce, sortBy} from "lodash";
import {IDesigner} from '@alilc/lce-graph-x6-designer';
import {saveSchema} from "../services/mockService";

/**
 * X6 Designer 业务自定义扩展插件
 */
function pluginSchemaLoader(ctx: IPublicModelPluginContext) {
    return {
        init() {
            console.log('init the plugin schema loader')
            //load 仅限于非 Intellij 环境使用。
            // loadSchema().then(schema => {
            //     console.log('got loaded schema:', schema)
            //     schema.children = sortBy(schema.children, value => {
            //         if (value.componentName == 'Line') {
            //             return -1;
            //         } else {
            //             return 1;
            //         }
            //     });
            //     ctx.project.openDocument(schema);
            // });
            //非 Intellij 环境不会触发
            event.on("common:SchemaChanged", (args: any[]) => {
                let schema = args[0];
                console.log('got changed schema:', schema)
                schema.children = sortBy(schema.children, value => {
                    if (value.componentName == 'Line') {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                console.log('after sort schema:', schema)
                let doc = ctx.project.currentDocument;
                if (null != doc) {
                    ctx.project.removeDocument(doc);
                }
                ctx.project.openDocument(schema);
                const x6Designer = ctx.plugins['plugin-x6-designer'] as IDesigner;
                x6Designer.getGraph().centerContent();
                ctx.project.currentDocument?.onAddNode(node => {
                    console.log('node add....');
                    debounce(saveSchema, 5000)(ctx.project.getCurrentDocument()?.exportSchema(IPublicEnumTransformStage.Save));
                });
                ctx.project.currentDocument?.onRemoveNode(node => {
                    console.log('node removed....');
                    debounce(saveSchema, 5000)(ctx.project.getCurrentDocument()?.exportSchema(IPublicEnumTransformStage.Save));
                });
                ctx.project.currentDocument?.onChangeNodeProp(info => {
                    console.log('node prop changed....');
                    debounce(saveSchema, 5000)(ctx.project.getCurrentDocument()?.exportSchema(IPublicEnumTransformStage.Save));
                });

            })
        },
        destroy() {
            event.off("common:SchemaChanged", () => {
            });
        },
    }
}

pluginSchemaLoader.pluginName = 'plugin-schema-loader';

export default pluginSchemaLoader;
