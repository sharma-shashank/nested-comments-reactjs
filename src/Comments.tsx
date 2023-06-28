import axios from "axios";
import "./App.css";
import { useRef, useState } from "react";

type ICommentsTextProps = {
  comments: Array<IComments>;
  setUpdateComments: any;
  setInputValue: any;
  inputValue: string;
};

type IComments = {
  id: any;
  text: string;
  replyBtn: string,
  likeBtn: string,
  isLiked: boolean,
  replies: Array<any>;
}

export default function CommentsText({ comments, setUpdateComments, setInputValue, inputValue }: ICommentsTextProps) {
  const cancelToken = useRef(null);
  const url = 'https://fakestoreapi.com/products';

  const submitReply = (arr: Array<any>, id: any) => {
    arr.forEach(item => {
      if (item.id === id) {
        const obj = {
          id: id + Math.random(),
          text: inputValue,
          replyBtn: 'Reply',
          likeBtn: 'Like',
          replies: [],
        } as IComments;
        item.replies = [...item.replies, obj];
        return;
      } else {
        submitReply(item.replies, id);
      }
    });
    setUpdateComments([...comments]);
  }

  const handleChange = (ev, i, id) => {
    const value = ev.target.value;
    setInputValue(value);
  }

  const handelApiAbort = async () => {
    if (cancelToken.current) {
      const str = 'cancled due to new request!';
      cancelToken.current.cancel(str);
    }
    cancelToken.current = axios.CancelToken.source();
    try {
      let _data = await axios.get(url, {
        cancelToken: cancelToken.current.token
      });
      console.log('abort -- ', _data);
    } catch (error) {
      console.log('cancel error -- ', error);
    }
  }

  return (
    <div className="comment-box">
      <button type="button" onClick={() => handelApiAbort()}>Abort handler</button>
      {comments.map((item, i) => {
        return (
          <>
            <div className="comment-text-cont" key={item.id}>
              <div>{item.text}</div>
              <button type="button">
                {item.likeBtn}
              </button>
              <button type="button" onClick={(ev) => submitReply(comments, item.id)}>
                {item.replyBtn}
              </button>
              <input type="text" style={{ width: '20%' }} onChange={(ev) => handleChange(ev, i, item.id)} />
            </div>
            <div style={{ paddingLeft: "20px" }} key={item.id + 1}>
              {item.replies.length ? (
                <CommentsText comments={item.replies} setInputValue={setInputValue} setUpdateComments={setUpdateComments} inputValue={inputValue} />
              ) : (
                ""
              )}
            </div>
          </>
        );
      })}
    </div>
  );
}
