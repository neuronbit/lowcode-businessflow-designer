import * as React from "react";
import { Search, Menu, Button } from "@alifd/next";
import "./style.less";
import {event} from "@alilc/lowcode-engine";

interface ClazzSetterSetterProps {
  // 当前值
  value: string;
  // 默认值
  defaultValue: string;
  // setter 唯一输出
  onChange: (val: string) => void;
  // AltStringSetter 特殊配置
  placeholder: string;

  field: any;
}

interface  ClazzSetterSetterState {
}

export default class ClazzSetter extends React.PureComponent<ClazzSetterSetterProps, ClazzSetterSetterState> {
  // 声明 Setter 的 title
  static displayName = 'ClazzSetter';

  constructor(props:ClazzSetterSetterProps) {
    super(props);
    this.state = {
    };

    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(filterValue:any) {
    console.log( filterValue);
    const {field} = this.props;
    window.filterJavaClazz(JSON.stringify({fieldId: field.id}));
  }

  componentDidMount() {
    const { onChange, value, defaultValue, field } = this.props;
    if (value == undefined && defaultValue) {
      onChange(defaultValue);
    }
    event.on('common:ClazzEvent', (args:any)=>{
      console.log("ClazzEvent", args)
      if (args[0] != field.id) {
        return;
      }
      onChange(args[1]);
    })
  }

  componentWillUnmount() {
    event.off('common:ClazzEvent',()=>{});
  }

  render() {
    const {  value } = this.props;

    return (
          <Search
              style={{width:'100%'}}
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
