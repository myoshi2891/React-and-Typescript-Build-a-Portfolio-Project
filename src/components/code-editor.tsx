import MonacoEditor from "@monaco-editor/react";

const CodeEditor = () => {
	return (
		<MonacoEditor
			language="javascript"
			theme="dark"
			options={{ wordWrap: "on" }}
			height="500px"
		/>
	);
};

export default CodeEditor;
