import {IPublicEnumTransformStage, IPublicModelPluginContext} from '@alilc/lowcode-types';
import {IDesigner} from '@alilc/lce-graph-x6-designer';
import * as React from 'react';
import {Graph, Markup} from '@antv/x6';
import ReactDOM from 'react-dom';
import {event, project} from '@alilc/lowcode-engine';
import {saveSchema} from "../services/mockService";

/**
 * X6 Designer 业务自定义扩展插件
 */
function pluginX6DesignerExtension(ctx: IPublicModelPluginContext) {
    return {
        init() {
            //会导致整个 Intellij 卡住
            // let newVar = (p:any) => {
            //     console.log('save')
            //     saveSchema(ctx.project.getCurrentDocument()?.exportSchema(IPublicEnumTransformStage.Save));
            // };
            // ctx.project.getCurrentDocument()?.onAddNode(newVar);
            // ctx.project.getCurrentDocument()?.onRemoveNode(newVar);
            // ctx.project.getCurrentDocument()?.onChangeNodeProp(newVar);
            // ctx.project.getCurrentDocument()?.onChangeNodeChildren(newVar);

            // 获取 x6 designer 内置插件的导出 api
            const x6Designer = ctx.plugins['plugin-x6-designer'] as IDesigner;

            x6Designer.onNodeRender((model, node) => {
                // @ts-ignore
                // 自定义 node 渲染逻辑
                const {name, title} = model.propsData;
                console.log('component of node is ', model.componentName)
                node.attr('text/textWrap/text', title || name);
            });

            x6Designer.onEdgeRender((model, edge) => {
                // @ts-ignore
                const {source, target, sourcePortId, targetPortId, name, title} = model.propsData;
                console.log('propsData of edge', model.propsData)
                requestAnimationFrame(() => {
                    edge.setSource({cell: source, port: sourcePortId});
                    edge.setTarget({cell: target, port: targetPortId});
                });

                let labelPart: string = "";
                if (source) {
                    let sourceNode = project.getCurrentDocument()?.getNodeById(source);
                    console.log('component name of source node', sourceNode?.componentName)
                    if (sourceNode?.componentName == 'Decision') {
                        model.setPropValue('isDecision', true);
                        console.log('decision value after set', model.getPropValue('isDecision'))
                        labelPart = ':' + model.getPropValue('decisionExpression')
                    }
                    if (sourceNode?.componentName == 'SwitchTask') {
                        model.setPropValue('isSwitch', true);
                        console.log('decision value after set', model.getPropValue('isSwitch'))
                        labelPart = ':' + model.getPropValue('switchCase')

                    }
                }

                // https://x6.antv.vision/zh/docs/tutorial/intermediate/edge-labels x6 标签模块
                // appendLabel 会触发 onEdgeLabelRender
                let text = ((name || title)?(name || title):"") + labelPart;
                edge.setLabels({
                    markup: Markup.getForeignObjectMarkup(),
                    attrs: {
                        fo: {
                            width: 120,
                            height: 30,
                            x: 0,
                            y: -15,
                        },
                        label: {text: text}
                    },
                });
            });

            x6Designer.onEdgeLabelRender((args) => {
                const {selectors, label} = args
                const content = selectors.foContent as HTMLDivElement
                if (content) {
                    ReactDOM.render(<div>{label.attrs.label.text}</div>, content)
                }
            });

            event.on('common:Predecessor', (args: any[]) => {
                console.log('get Predecessor event', args)
                let graph: Graph = x6Designer.getGraph();
                console.log('root node is ', graph.getRootNodes());
                let nodes = graph.getRootNodes().map(n => {
                    let nodeById = ctx.project.getCurrentDocument()?.getNodeById(n.id);
                    if (nodeById?.componentName == 'Flow') {
                        return nodeById;
                    }
                }).filter(n=>n);
                let flowParams:any;
                console.log('node of flow is', nodes)
                if (nodes && nodes.length == 1) {
                    flowParams = nodes[0].getPropValue("params");
                }
                console.log('params of flow is', flowParams)
                let currentNode = graph.getCellById(args[0].id);
                console.log('cell by id', currentNode);
                let predecessors = graph.getPredecessors(currentNode);
                console.log('processors of cell is', predecessors);
                let ids = predecessors.map(c => c.id);
                console.log('processors id of cell is', ids);
                const returns = ids.map(id => {
                    let nodeById = ctx.project.getCurrentDocument()?.getNodeById(id);
                    console.log('node get by id', nodeById);
                    if (nodeById) {
                        return {name: nodeById.getPropValue("name"), returns: nodeById.getPropValue('returns')};
                    } else {
                        return {};
                    }
                });
                console.log('processors returns of cell is', returns);
                window.filterJavaParam(JSON.stringify({fieldId:args[2], returns: returns, value: args[1], flowParams:flowParams, paramType:args[3]}));
            });
        },
        destroy() {
            event.off('common:Predecessor', () => {
            });
        }
    }
}

pluginX6DesignerExtension.pluginName = 'plugin-x6-designer-extension';

export default pluginX6DesignerExtension;
