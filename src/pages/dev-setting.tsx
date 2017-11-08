import * as React from 'react';
import { UserData } from "../models";
import { ObjectOmit } from "typelevel-ts";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { RouteComponentProps } from "react-router-dom";
import {
  apiClient,
  list
} from "../utils";
import { Snack, Client, ClientEditor } from "../components";
import {
  Paper
} from "material-ui";
import * as api from "@anontown/api-types";
import * as Im from "immutable";

type _DevSettingPageProps = RouteComponentProps<{}> & {
  user: UserData | null
};

export type DevSettingPageProps = ObjectOmit<_DevSettingPageProps, 'user'>;

interface DevSettingPageState {
  clients: Im.List<api.Client>,
  snackMsg: string | null,
}

class _DevSettingPage extends React.Component<_DevSettingPageProps, DevSettingPageState> {
  constructor(props: _DevSettingPageProps) {
    super(props);
    this.state = {
      snackMsg: null,
      clients: Im.List()
    };

    if (this.props.user !== null) {
      apiClient
        .findClientAll(this.props.user.token)
        .subscribe(clients => {
          this.setState({ clients: Im.List(clients) });
        }, () => {
          this.setState({ snackMsg: "クライアント情報取得に失敗しました。" })
        });
    }
  }

  render() {
    return this.props.user !== null
      ? <Paper>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.state.clients.map(c => <Client
          client={c}
          onUpdate={c => this.setState({ clients: list.update(this.state.clients, c) })} />)}
        <ClientEditor
          client={null}
          onAdd={c => this.setState({ clients: this.state.clients.push(c) })} />
      </Paper>
      : <div>ログインして下さい。</div>;
  }
}

export const DevSettingPage = connect((state: Store) => ({ user: state.user }))(_DevSettingPage);