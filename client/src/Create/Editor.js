import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default function RichEditor({ initialState, onFocusLost }) {

  const [state, setState] = useState(
    Object.keys(initialState).length > 0 ?
      EditorState.createWithContent(convertFromRaw(initialState))
      : EditorState.createEmpty()
  );

  const callFocusLost = () => {
    let _stateContent = convertToRaw(state.getCurrentContent());
    onFocusLost(_stateContent);
  }

  return (
    <>
      <Editor
        onBlur={callFocusLost}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="newQuestionEditor"
        editorState={state}
        onEditorStateChange={(editorState) => setState(editorState)}
      />
    </>
  );
}