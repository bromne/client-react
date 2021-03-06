import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { Paper, RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import * as style from "./profile-editor.scss";
import { UserData } from "../models";

interface ProfileEditorProps {
  profile: api.Profile | null;
  onUpdate?: (profile: api.Profile) => void;
  onAdd?: (profile: api.Profile) => void;
  userData: UserData;
}

interface ProfileEditorState {
  errors: string[];
  sn: string;
  name: string;
  text: string;
}

export class ProfileEditor extends React.Component<ProfileEditorProps, ProfileEditorState> {
  constructor(props: ProfileEditorProps) {
    super(props);
    this.state = {
      errors: [],
      sn: props.profile !== null ? props.profile.sn : "",
      name: props.profile !== null ? props.profile.name : "",
      text: props.profile !== null ? props.profile.text : "",
    };
  }

  render() {
    return <Paper className={style.container}>
      <form>
        <Errors errors={this.state.errors} />
        <TextField
          fullWidth
          floatingLabelText="ID"
          value={this.state.sn}
          onChange={(_e, v) => this.setState({ sn: v })} />
        <TextField
          fullWidth
          floatingLabelText="名前"
          value={this.state.name}
          onChange={(_e, v) => this.setState({ name: v })} />
        <MdEditor
          fullWidth
          value={this.state.text}
          onChange={v => this.setState({ text: v })} />
        <RaisedButton onClick={() => this.submit()} label="OK" />
      </form>
    </Paper>;
  }

  async submit() {
    try {
      if (this.props.profile !== null) {
        const profile = await apiClient.updateProfile(this.props.userData.token, {
          id: this.props.profile.id,
          name: this.state.name,
          text: this.state.text,
          sn: this.state.sn,
        });
        if (this.props.onUpdate) {
          this.props.onUpdate(profile);
        }
        this.setState({ errors: [] });
      } else {
        const profile = await apiClient.createProfile(this.props.userData.token, {
          name: this.state.name,
          text: this.state.text,
          sn: this.state.sn,
        });

        if (this.props.onAdd) {
          this.props.onAdd(profile);
        }
        this.setState({ errors: [] });
      }
    } catch (e) {
      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    }
  }
}
