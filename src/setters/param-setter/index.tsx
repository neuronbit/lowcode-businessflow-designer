import * as React from "react";
import {Search} from "@alifd/next";
import "./style.less";
import {event, Node} from "@alilc/lowcode-engine";

interface ParamSetterSetterProps {
    // 当前值
    value: string;
    // 默认值
    defaultValue: string;
    // setter 唯一输出
    onChange: (val: string) => void;
    // AltStringSetter 特殊配置
    placeholder: string;

    field: any;

    selected: Node;
}

interface ParamSetterSetterState {
}

export default class ParamSetter extends React.PureComponent<ParamSetterSetterProps, ParamSetterSetterState> {
    // 声明 Setter 的 title
    static displayName = 'ParamSetter';

    constructor(props: ParamSetterSetterProps) {
        super(props);
        this.state = {};

        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(filterValue: any) {
        const {field, value} = this.props;
        //window.filterJavaParam(filterValue);
        debugger
        console.log('field node in the param setter', field.node);

        event.emit('Predecessor', [field.node, value, field.id, field.parent.getPropValue('paramType')])
    }

    componentDidMount() {
        const {onChange, value, defaultValue, field} = this.props;
        if (value == undefined && defaultValue) {
            onChange(defaultValue);
        }
        event.on('common:ParamEvent', (args: any) => {
            console.log("ParamEvent", args)
            if (args[0] != field.id) {
                return;
            }
            onChange(args[1]);
        })
    }

    componentWillUnmount() {
        event.off('common:ParamEvent', () => {
        });
    }

    render() {
        const {value} = this.props;

        return (
            <Search
                style={{width: '100%'}}
                value={value}
                shape={'simple'}
                readOnly={true}
                onSearch={this.onSearch}
                hasIcon={true}
                hasClear={true}
            />
        );
    }
}
