import * as Im from "immutable";
import {
  Dialog,
  FontIcon,
  IconButton,
  ListItem,
  MenuItem,
  SelectField,
} from "material-ui";
import * as React from "react";
import { ng } from "../../models";
import { list } from "../../utils";
import { NGBodyNodeEditor } from "./ng-body-node-editor";
import { NGHashNodeEditor } from "./ng-hash-node-editor";
import { NGNameNodeEditor } from "./ng-name-node-editor";
import { NGProfileNodeEditor } from "./ng-profile-node-editor";
import { NGVoteNodeEditor } from "./ng-vote-node-editor";

export interface NGNodesEditorState {
}
export interface NGNodesEditorProps {
  values: Im.List<ng.NGNode>;
  onChange: (nodes: Im.List<ng.NGNode>) => void;
  select: React.ReactNode;
  primaryText: React.ReactNode;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}
export class NGNodesEditor extends React.Component<NGNodesEditorProps, NGNodesEditorState> {
  constructor(props: NGNodesEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <>
      <Dialog
        open={this.props.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.props.changeOpenDialog(false)}>
        {this.props.select}
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        open={true}
        primaryText={<>
          <a onClick={e => {
            e.stopPropagation();
            this.props.onChange(this.props.values.insert(0, ng.createDefaultNode()));
          }}>[+]</a>
          {this.props.primaryText}
        </>}
        autoGenerateNestedIndicator={false}
        nestedItems={this.props.values.map(value => <NGNodeEditor
          key={value.id}
          value={value}
          onChange={x => this.props.onChange(list.update(this.props.values, x))}
          nestedLevel={this.props.nestedLevel + 1}
          rightIconButton={<IconButton
            onClick={() => this.props.onChange(this.props.values.filter(x => x.id !== value.id))}>
            <FontIcon className="material-icons">close</FontIcon>
          </IconButton>}
        />)
          .toArray()} />
    </>;
  }
}

export interface NGNodeEditorState {
  openDialog: boolean;
}

export interface NGNodeEditorProps {
  value: ng.NGNode;
  onChange: (node: ng.NGNode) => void;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
}

export class NGNodeEditor extends React.Component<NGNodeEditorProps, NGNodeEditorState> {
  constructor(props: NGNodeEditorProps) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

  render(): React.ReactNode {
    const select = <SelectField
      floatingLabelText="タイプ"
      value={this.props.value.type}
      onChange={(_e, _i, type) => {
        switch (type) {
          case "not":
            this.props.onChange({
              id: this.props.value.id,
              type: "not",
              child: ng.createDefaultNode(),
            });
            break;
          case "and":
            this.props.onChange({
              id: this.props.value.id,
              type: "and",
              children: Im.List(),
            });
            break;
          case "or":
            this.props.onChange({
              id: this.props.value.id,
              type: "or",
              children: Im.List(),
            });
            break;
          case "profile":
            this.props.onChange({
              id: this.props.value.id,
              type: "profile",
              profile: "",
            });
            break;
          case "hash":
            this.props.onChange({
              id: this.props.value.id,
              type: "hash",
              hash: "",
            });
            break;
          case "body":
            this.props.onChange({
              id: this.props.value.id,
              type: "body",
              matcher: {
                type: "text",
                i: false,
                source: "",
              },
            });
            break;
          case "name":
            this.props.onChange({
              id: this.props.value.id,
              type: "name",
              matcher: {
                type: "text",
                i: false,
                source: "",
              },
            });
            break;
          case "vote":
            this.props.onChange({
              id: this.props.value.id,
              type: "vote",
              value: -5,
            });
            break;
        }
      }}
    >
      <MenuItem value={"not"} primaryText="not" />
      <MenuItem value={"and"} primaryText="and" />
      <MenuItem value={"or"} primaryText="or" />
      <MenuItem value={"profile"} primaryText="profile" />
      <MenuItem value={"hash"} primaryText="hash" />
      <MenuItem value={"body"} primaryText="body" />
      <MenuItem value={"name"} primaryText="name" />
      <MenuItem value={"vote"} primaryText="vote" />
    </SelectField>;
    return this.props.value.type === "not" ? <NGNotNodeEditor
      nestedLevel={this.props.nestedLevel}
      rightIconButton={this.props.rightIconButton}
      openDialog={this.state.openDialog}
      changeOpenDialog={v => this.setState({ openDialog: v })}
      value={this.props.value}
      select={select}
      onChange={v => this.props.onChange(v)} />
      : this.props.value.type === "and" ? <NGAndNodeEditor
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        select={select}
        openDialog={this.state.openDialog}
        changeOpenDialog={v => this.setState({ openDialog: v })}
        value={this.props.value}
        onChange={v => this.props.onChange(v)} />
        : this.props.value.type === "or" ? <NGOrNodeEditor
          nestedLevel={this.props.nestedLevel}
          rightIconButton={this.props.rightIconButton}
          select={select}
          openDialog={this.state.openDialog}
          changeOpenDialog={v => this.setState({ openDialog: v })}
          value={this.props.value}
          onChange={v => this.props.onChange(v)} />
          : this.props.value.type === "profile" ? <NGProfileNodeEditor
            nestedLevel={this.props.nestedLevel}
            rightIconButton={this.props.rightIconButton}
            select={select}
            openDialog={this.state.openDialog}
            changeOpenDialog={v => this.setState({ openDialog: v })}
            value={this.props.value}
            onChange={v => this.props.onChange(v)} />
            : this.props.value.type === "hash" ? <NGHashNodeEditor
              nestedLevel={this.props.nestedLevel}
              rightIconButton={this.props.rightIconButton}
              select={select}
              openDialog={this.state.openDialog}
              changeOpenDialog={v => this.setState({ openDialog: v })}
              value={this.props.value}
              onChange={v => this.props.onChange(v)} />
              : this.props.value.type === "body" ? <NGBodyNodeEditor
                nestedLevel={this.props.nestedLevel}
                rightIconButton={this.props.rightIconButton}
                openDialog={this.state.openDialog}
                changeOpenDialog={v => this.setState({ openDialog: v })}
                select={select}
                value={this.props.value}
                onChange={v => this.props.onChange(v)} />
                : this.props.value.type === "name" ? <NGNameNodeEditor
                  nestedLevel={this.props.nestedLevel}
                  rightIconButton={this.props.rightIconButton}
                  openDialog={this.state.openDialog}
                  changeOpenDialog={v => this.setState({ openDialog: v })}
                  select={select}
                  value={this.props.value}
                  onChange={v => this.props.onChange(v)} />
                  : this.props.value.type === "vote" ? <NGVoteNodeEditor
                    nestedLevel={this.props.nestedLevel}
                    rightIconButton={this.props.rightIconButton}
                    select={select}
                    openDialog={this.state.openDialog}
                    changeOpenDialog={v => this.setState({ openDialog: v })}
                    value={this.props.value}
                    onChange={v => this.props.onChange(v)} />
                    : null;
  }
}

export interface NGOrNodeEditorProps {
  value: ng.NGNodeOr;
  onChange: (node: ng.NGNodeOr) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}

export interface NGOrNodeEditorState {

}

export class NGOrNodeEditor extends React.Component<NGOrNodeEditorProps, NGOrNodeEditorState> {
  constructor(props: NGOrNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGNodesEditor
      openDialog={this.props.openDialog}
      changeOpenDialog={this.props.changeOpenDialog}
      select={this.props.select}
      nestedLevel={this.props.nestedLevel}
      rightIconButton={this.props.rightIconButton}
      primaryText="Or"
      values={this.props.value.children} onChange={nodes => {
        this.props.onChange({
          ...this.props.value,
          children: nodes,
        });
      }} />;
  }
}

export interface NGAndNodeEditorProps {
  value: ng.NGNodeAnd;
  onChange: (node: ng.NGNodeAnd) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}

export interface NGAndNodeEditorState {

}

export class NGAndNodeEditor extends React.Component<NGAndNodeEditorProps, NGAndNodeEditorState> {
  constructor(props: NGAndNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGNodesEditor
      openDialog={this.props.openDialog}
      changeOpenDialog={this.props.changeOpenDialog}
      nestedLevel={this.props.nestedLevel}
      rightIconButton={this.props.rightIconButton}
      select={this.props.select}
      values={this.props.value.children}
      primaryText="And"
      onChange={node => {
        this.props.onChange({
          ...this.props.value,
          children: node,
        });
      }} />;
  }
}

export interface NGNotNodeEditorProps {
  value: ng.NGNodeNot;
  onChange: (node: ng.NGNodeNot) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}

export interface NGNotNodeEditorState {
}

export class NGNotNodeEditor extends React.Component<NGNotNodeEditorProps, NGNotNodeEditorState> {
  constructor(props: NGNotNodeEditorProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <>
      <Dialog
        open={this.props.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.props.changeOpenDialog(false)}>
        {this.props.select}
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        open={true}
        primaryText="Not"
        autoGenerateNestedIndicator={false}
        nestedItems={[
          <NGNodeEditor
            nestedLevel={this.props.nestedLevel + 1}
            key="node"
            value={this.props.value.child} onChange={node => {
              this.props.onChange({
                ...this.props.value,
                child: node,
              });
            }} />,
        ]} />
    </>;
  }
}