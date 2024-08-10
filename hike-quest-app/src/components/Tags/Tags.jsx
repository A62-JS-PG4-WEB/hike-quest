import { useContext } from "react"
import { AppContext } from "../../state/app.context";

export default function Tags(){
const { userData} = useContext(AppContext);


console.log(userData);
    return (
        <>
         <label className="addHashtag" htmlFor="hashtag">Hashtags</label>
          <textarea
            className='commentBox'
            id="hashtag"
            name="hashtag"
            // value={thread.hashtag || ''}
            // onChange={onChange}
          />
          <small>Separate Hashtags by coma</small> <br />
          </>
    )
}