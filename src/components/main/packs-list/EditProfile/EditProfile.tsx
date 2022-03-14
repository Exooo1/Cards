import React, {ChangeEvent, FormEventHandler, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import SuperTextField from '../../../mui/text-field/SuperTextField';
import {useAppSelector} from '../../../../redux/store';
import {selectUserName} from '../../../../assets/selectors/authSelectors';
import {updateProfile} from '../../../../redux/authReducer';
import {setFileAC, setFileReaderAC} from '../../../../redux/fileReducer';

export const EditProfile = () => {
        const nickName = useAppSelector(selectUserName);
        const [name, setName] = useState(nickName || '');
        const [reader, setReader] = useState<boolean>(false)
        const [baseURL, setBaseURL] = useState<boolean>(false)
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const clickHandler: FormEventHandler<HTMLFormElement> = async (e) => {
            e.preventDefault();
            await dispatch(updateProfile({name}));
            navigate('/profile');
        };
        const changeReader = () => {
            setReader(!reader)
        }
        const changeBaseURL = () => {
            setBaseURL(!baseURL)
        }
        const addFile = (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files && e.target.files[0]
            const fileReader = new FileReader()
            if (file) {
                dispatch(setFileAC({
                    nameFile: file.name,
                    size: file.size / 1000,
                    typeImage: file.type,
                    lastModified: file.lastModified,
                    newFile: window.URL.createObjectURL(file),
                    simpleFile: file
                }))
                if (reader) {
                    fileReader.readAsText(file)
                    fileReader.onloadend = () => {
                        if (fileReader.result) dispatch(setFileReaderAC(fileReader.result))
                    }
                }
                if (baseURL) {
                    fileReader.readAsDataURL(file)
                    fileReader.onloadend = () => {
                        if (fileReader.result) dispatch(setFileReaderAC(fileReader.result))
                    }
                }
            }

        }
        const b =2
        return (
            <form onSubmit={clickHandler}>
                <SuperTextField type={'Nickname'} value={name} callback={setName}/>
                <input name="myFile" type="file" multiple
                       onChange={addFile}/>
                <button type='submit'>Save</button>
                <div>
                    <p>Reader</p> <input type="checkbox" checked={reader}
                                         onChange={changeReader}/>
                    <p>BaseURL</p> <input type="checkbox" checked={baseURL} onChange={changeBaseURL}/>
                </div>
            </form>
        );
    }
;
