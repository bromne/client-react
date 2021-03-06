import {
  Dialog,
  FontIcon,
  IconButton,
  List,
  ListItem,
} from "material-ui";
import * as React from "react";
import { ng, UserData } from "../models";
import { list } from "../utils";
import { NGEditor } from "./ng-editor";

interface NGProps {
  userData: UserData;
  onChangeUserData: (user: UserData | null) => void;
}

interface NGState {
  dialog: string | null;
}

export class NG extends React.Component<NGProps, NGState> {
  constructor(props: NGProps) {
    super(props);
    this.state = {
      dialog: null,
    };
  }

  render() {
    return <div>
      <IconButton onClick={() => this.props.onChangeUserData({
        ...this.props.userData, storage: {
          ...this.props.userData.storage,
          ng: this.props.userData.storage.ng.insert(0, ng.createDefaultNG()),
        },
      })}>
        <FontIcon className="material-icons">add_circle</FontIcon>
      </IconButton>
      <List>
        {this.props.userData.storage.ng.map(node =>
          <ListItem
            rightIconButton={<IconButton onClick={() => this.props.onChangeUserData({
              ...this.props.userData, storage: {
                ...this.props.userData.storage,
                ng: this.props.userData.storage.ng.filter(x => x.id !== node.id),
              },
            })}>
              <FontIcon className="material-icons">close</FontIcon>
            </IconButton>}
            onClick={() => this.setState({ dialog: node.id })}
            key={node.id}
            primaryText={node.name}>
            <Dialog
              title={node.name}
              open={this.state.dialog === node.id}
              autoScrollBodyContent={true}
              onRequestClose={() => this.setState({ dialog: null })}>
              <NGEditor
                ng={node}
                onUpdate={v => this.props.onChangeUserData({
                  ...this.props.userData, storage: {
                    ...this.props.userData.storage,
                    ng: list.update(this.props.userData.storage.ng, v),
                  },
                })} />
            </Dialog>
          </ListItem>)}
      </List>
    </div>;
  }
}
