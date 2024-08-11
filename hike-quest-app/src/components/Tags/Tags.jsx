import { useContext } from "react"
import { AppContext } from "../../state/app.context";
import PropTypes from 'prop-types';
import { useState } from "react";
import { createTag } from "../../services/threads.service";

export default function Tags({ thread }){
const [tags, setTags] = useState({
    tag: '',
  });
  const { userData } = useContext(AppContext);

  const updateTag = (key, value) => {
    console.log(value);
    console.log( key);
    setTags({
   ...tags,
      [key]: value,
    });
  };


  const handleCreateTags = async () => {
   
    try {
      await createTag(thread.id, tags.tag);
      setTags({ tag: '' });
    } catch (error) {
      alert(error.message);
    }
  };


console.log(thread);
    return (
        <>
      <label className="addHashtag" htmlFor="hashtag">Hashtags</label>
      <textarea
        className='commentBox'
        id="hashtag"
        name="hashtag"
        value={tags.tag || ''}
        onChange={e => updateTag("tag", e.target.value)} 
      />
      <small>Separate Hashtags by comma</small> <br />
      <button onClick={handleCreateTags}>Add Tag</button>
    </>
  );
}
//         <>
//          <label className="addHashtag" htmlFor="hashtag">Hashtags</label>
//           <textarea
//             className='commentBox'
//             id="hashtag"
//             name="hashtag"
//             value={tags.tag || ''}
//             onChange={e => updateTag("tags", e.target.value)} 
//     //   <input value={tweet.title} onChange={e => updateTweet('title', e.target.value)} type="text" name="title" id="title" /><br/>
   
//             // value={thread.hashtag || ''}
//             // onChange={onChange}
//           />
//           <small>Separate Hashtags by coma</small> <br />
//           </>
//     )
// }

Tags.propTypes = {
    thread: PropTypes.shape({
      uid: PropTypes.string.isRequired
    }).isRequired,
  };