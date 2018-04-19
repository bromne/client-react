import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Paper,
} from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  ClientEditor,
  Snack,
} from "../../components";
import { myInject, UserStore } from "../../stores";
import {
  apiClient,
  list,
} from "../../utils";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react";

interface DevSettingPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface DevSettingPageState {
  clients: Im.List<api.Client>;
  snackMsg: string | null;
}

export const DevSettingPage =
  withRouter(myInject(["user"], observer(class extends React.Component<DevSettingPageProps, DevSettingPageState> {
    constructor(props: DevSettingPageProps) {
      super(props);
      this.state = {
        snackMsg: null,
        clients: Im.List(),
      };

      (async () => {
        try {
          if (this.props.user.data !== null) {
            const clients = await apiClient
              .findClientAll(this.props.user.data.token);
            this.setState({ clients: Im.List(clients) });
          }
        } catch{
          this.setState({ snackMsg: "クライアント情報取得に失敗しました。" });
        }
      })();
    }

    render() {
      return this.props.user.data !== null
        ? <Paper>
          <Helmet>
            <title>開発者向け</title>
          </Helmet>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.state.clients.map(c => <ClientEditor
            client={c}
            onUpdate={newClient => this.setState({ clients: list.update(this.state.clients, newClient) })} />)}
          <ClientEditor
            client={null}
            onAdd={c => this.setState({ clients: this.state.clients.push(c) })} />
        </Paper>
        : <div>ログインして下さい。</div>;
    }
  })));
