import * as api from "@anontown/api-types";
import { IconButton, Paper } from "material-ui";
import { EditorModeEdit } from "material-ui/svg-icons";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { ClientEditor } from "./client-editor";

interface UnconnectedClientProps {
  client: api.Client;
  onUpdate?: (client: api.Client) => void;
  user: UserData | null;
}

export type ClientProps = ObjectOmit<UnconnectedClientProps, "user">;

interface ClientState {
  edit: boolean;
}

export const Client = connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<UnconnectedClientProps, ClientState> {
    constructor(props: UnconnectedClientProps) {
      super(props);
      this.state = {
        edit: false,
      };
    }

    render() {
      const clientEditor = this.state.edit
        ? <ClientEditor client={this.props.client} onUpdate={this.props.onUpdate} />
        : null;

      const edit = this.props.user !== null && this.props.user.token.user === this.props.client.user
        ? <div>
          <IconButton type="button" onClick={() => this.setState({ edit: !this.state.edit })} >
            <EditorModeEdit />
          </IconButton>
          {clientEditor}
        </div >
        : null;

      return (
        <Paper>
          <h2>{this.props.client.name}</h2>
          <span>{this.props.client.id}</span>
          <span>{this.props.client.url}</span>
          {edit}
        </Paper>
      );
    }
  });
