import * as React from "react";
import {Search} from "@alifd/next";
import "./style.less";
import {event, Node} from "@alilc/lowcode-engine";

interface MethodSetterSetterProps {
    // 当前值
    value: string;
    // 默认值
    defaultValue: string;
    // setter 唯一输出
    onChange: (val: string) => void;
    // AltStringSetter 特殊配置
    placeholder: string;
    field: any;
    returnType: string;
    selected: Node
}

interface MethodSetterSetterState {
}

export default class MethodSetter extends React.PureComponent<MethodSetterSetterProps, MethodSetterSetterState> {
    // 声明 Setter 的 title
    static displayName = 'MethodSetter';

    constructor(props: MethodSetterSetterProps) {
        super(props);
        this.state = {};

        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(filterValue: any) {
        const {field} = this.props;
        window.filterJavaMethod(JSON.stringify({returnType: this.props.returnType, fieldId: field.id}));
    }

    componentDidMount() {
        const {onChange, value, defaultValue, field, returnType} = this.props;
        console.log('get into componentDidMount, value , default value, returnType', value, defaultValue, returnType)
        if (value == undefined && defaultValue) {
             (defaultValue);
        }

        console.log("props of method Setter", this.props.selected)

        event.on('common:MethodEvent', (args: string[]) => {
            console.log("MethodEvent", args)
            if (args[0] != field.id) {
                return;
            }
            let parse = JSON.parse(args[1]);
            onChange(parse.className + "." + parse.methodName);
            field.parent.setPropValue('bean', parse.className);
            field.parent.setPropValue('params', parse.params);
            field.parent.setPropValue('returns.returnType', parse.returnType.toString());
            field.parent.setPropValue('returns.returnName', 'output');
            field.parent.setPropValue('enums', parse.returnEnums);
        })
    }

    componentWillUnmount() {
        console.log('get into componentWillUnmount')
        event.off('common:MethodEvent', () => {
        });
    }

    render() {
        const {value} = this.props;
        console.log('get into render, value is', value)
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
