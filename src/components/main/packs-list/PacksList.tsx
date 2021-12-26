import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import s from './PackList.module.scss';
import RangeSlider from '../../mui/range-slider/RangeSlider';
import { DenseTable } from '../../mui/table/Table';
import { ToggleOwnerPacksShowButtons } from './buttons/ToggleOwnerPacksShowButtons';
import { useAppSelector } from '../../../redux/store';
import {
	selectPacksPageNumber,
	selectPacksPageSize,
} from '../../../assets/selectors/authSelectors';
import { createPack, getPacks } from '../../../redux/packs-reducer';
import { PaginationPacksContainer } from '../../mui/pagination/PaginationPacksContainer';
import AddNewPack from "../../common/modal-windows/add-new-pack/AddNewPack";

function PackList() {
	const page = useAppSelector(selectPacksPageNumber);
	const pageCount = useAppSelector(selectPacksPageSize);
	const [search, setSearch] = useState<string>('');
	const dispatch = useDispatch();
	const { currentUserId } = useParams();
	useEffect(() => {
		dispatch(getPacks({ user_id: currentUserId, page, pageCount }));
	}, [currentUserId, page, pageCount]);

	const [addPackValue, setAddPackValue] = useState('');
	const addNewPackClickHandler = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addPackValue && dispatch(createPack(addPackValue, currentUserId));
		setAddPackValue('');
	};
	const handlerSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.currentTarget.value);
	};

	const searching = () => {
		dispatch(getPacks({ user_id: currentUserId, packName: search }));
	};

	return (
		<div>
			<div className={s.wrapper}>
				<div className={s.wrapLeft}>
					<h3 className={s.subtitle}>Show packs cards</h3>
					<ToggleOwnerPacksShowButtons />
					<h3 className={s.subtitleSlid}>Number of cards</h3>
					<RangeSlider />
				</div>
				<div className={s.wrapRight}>
					<h2 className={s.title}>Packs list</h2>
					<form className={s.wrapForm} onSubmit={addNewPackClickHandler}>
						<input
							className={s.input}
							value={addPackValue}
							onChange={(e) => setAddPackValue(e.currentTarget.value)}
							placeholder='Type here'
						/>
						<button className={s.button}>Add new pack</button>
					</form>
					<div className={s.wrapForm}>
						<input
							className={s.input}
							value={search}
							onChange={handlerSearch}
							type='text'
							placeholder='Search...'
						/>
						<button className={s.button} onClick={searching}>
							Search
						</button>
					</div>
					<div className={s.table}>
						<DenseTable />
						<div className={s.wrapBottom}>
							<PaginationPacksContainer />
						</div>
					</div>
				</div>
			</div>
			{/*<DeletePack />*/}
			{/*<AddNewPack />*/}
		</div>
	);
}

export default PackList;
