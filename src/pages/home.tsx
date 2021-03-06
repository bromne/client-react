import {
  Paper,
  Tab,
  Tabs,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page } from "../components";
import {
  TagFavo,
  TopicFavo,
} from "../components";
import { myInject, UserStore } from "../stores";

interface HomePageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export const HomePage = withRouter(myInject(["user"], observer
  ((props: HomePageProps) => {
    return <Page>
      <Helmet>
        <title>Anontown</title>
      </Helmet>
      {props.user.data !== null
        ? <Tabs>
          <Tab label="トピック">
            <TopicFavo detail={true} userData={props.user.data} />
          </Tab>
          <Tab label="タグ">
            <TagFavo userData={props.user.data} />
          </Tab>
        </Tabs>
        : <Paper>
          <h1>匿名掲示板Anontownへようこそ</h1>
          <ul>
            <li>
              <Link to="/topic/search">トピック一覧</Link>
            </li>
            <li>
              <a href="https://document.anontown.com/"
                target="_blank">説明書</a>
            </li>
          </ul>
        </Paper>}
    </Page>;
  })));
