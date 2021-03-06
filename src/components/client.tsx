import * as api from "@anontown/api-types";
import {
  FontIcon,
  IconButton,
} from "material-ui";
import * as React from "react";
import { ClientEditor } from "./client-editor";
import { UserData } from "../models";


interface ClientProps {
  client: api.Client;
  onUpdate?: (client: api.Client) => void;
  userData: UserData | null;
}

interface ClientState {
  edit: boolean;
}

export class Client extends React.Component<ClientProps, ClientState> {
  constructor(props: ClientProps) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  render() {
    const clientEditor = this.state.edit && this.props.userData !== null
      ? <ClientEditor client={this.props.client} onUpdate={this.props.onUpdate} userData={this.props.userData} />
      : null;

    const edit = this.props.userData !== null && this.props.userData.token.user === this.props.client.user
      ? <div>
        <IconButton type="button" onClick={() => this.setState({ edit: !this.state.edit })} >
          <FontIcon className="material-icons">edit</FontIcon>
        </IconButton>
        {clientEditor}
      </div >
      : null;

    return (
      <div>
        <h2>{this.props.client.name}</h2>
        <span>{this.props.client.id}</span>
        <span>{this.props.client.url}</span>
        {edit}
      </div>
    );
  }
}