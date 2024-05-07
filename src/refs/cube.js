/* 每列上下区域的风格，九种 */
const BranchStyle = {
	// 两段都没有
	None: 0,

	// 一段
	OneSegCutNone: 1,
	OneSegCutLeft: 2,
	OneSegCutRight: 3,
	OneSegCutBoth: 4,

	// 两段
	TwoSegsCutNone: 5,
	TwoSegsCutLeft: 6,
	TwoSegsCutRight: 7,
	TwoSegsCutBoth: 8,
};
const FACE_NAME_ARRAY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TEXT_RIGHT_ALIGNMENT = ' text-anchor="start"';
const TEXT_LEFT_ALIGNMENT = ' text-anchor="end"';

function countIt(options) {
	const {
		SIDE_LENGTH,
		MAX_X,
		MAX_Y,

		MAIN_COLUMN_MAX_INDEX,
		PASTE_AREA_END,
		ONE_ROD_SEG,

		PASTE_AREA_START,

		// 20220621，改APPEND_ONE_COLUMN_COUNT为APPEND_ONE_COLUMN_COUNT_ARRAY和DEFAULT_APPEND_ONE_COLUMN_COUNT
		// APPEND_ONE_COLUMN_COUNT,
		APPEND_ONE_COLUMN_COUNT_ARRAY,
		DEFAULT_APPEND_ONE_COLUMN_COUNT,

		VERTICAL_OVERLAP,

		NUMBER_OFFSET_X_SCALE,
		NUMBER_OFFSET_Y_SCALE,

		PASTE_AREA_HEIGHT_SCALE,

		ARC_RADIUS,
		PAPER_THICKNESS,

		OBLIQUE_LINE_SCALE,
		HOLE_OFFSET_SCALE,

		HIDE_BELOW_HORIZONTAL_LINE,
		HIDE_RIGHT_VERTICAL_LINE,

		STYLE_ARRAY,
		DEFAULT_ROD_STYLE_ARRAY,

		SHOW_MODEL_NO,
		SHOW_ROD_INDEX,
		START_ROD_INDEX,
		TOP_OR_BOTTOM_TEXT_COLOR,
		SHOW_FACE_NO,
	} = Object.assign({
			SIDE_LENGTH: 15,
			MAX_X: 410,
			MAX_Y: 289,

			MAIN_COLUMN_MAX_INDEX: 3,
			PASTE_AREA_END: 0,
			ONE_ROD_SEG: 5,

			PASTE_AREA_START: 0,

			// 20220621，改APPEND_ONE_COLUMN_COUNT为APPEND_ONE_COLUMN_COUNT_ARRAY和DEFAULT_APPEND_ONE_COLUMN_COUNT
			// APPEND_ONE_COLUMN_COUNT: 0,
			APPEND_ONE_COLUMN_COUNT_ARRAY: [],
			DEFAULT_APPEND_ONE_COLUMN_COUNT: 0,

			VERTICAL_OVERLAP: false,

			NUMBER_OFFSET_X_SCALE: 0.5,
			NUMBER_OFFSET_Y_SCALE: 0.5,

			// 安启，2022年6月5日，系数从0.5改0.925
			PASTE_AREA_HEIGHT_SCALE: 0.925,

			ARC_RADIUS: 3,
			PAPER_THICKNESS: 0.5,

			OBLIQUE_LINE_SCALE: 0.15,
			HOLE_OFFSET_SCALE: 0.2,

			HIDE_BELOW_HORIZONTAL_LINE: false,
			HIDE_RIGHT_VERTICAL_LINE: false,

			STYLE_ARRAY: [],
			DEFAULT_ROD_STYLE_ARRAY: [
				[0, 8, 0, 0, 0, 0],
				[0, 0, 8, 0, 0, 0],
				[0, 1, 0]
			],

			SHOW_MODEL_NO: true,
			SHOW_ROD_INDEX: true,
			START_ROD_INDEX: 1,
			TOP_OR_BOTTOM_TEXT_COLOR: '#000000',
			SHOW_FACE_NO: true,
		},
		options || {},
	);
	if (STYLE_ARRAY.length === 0) {
		return;
	}

	const NUMBER_OFFSET_X = SIDE_LENGTH * NUMBER_OFFSET_X_SCALE;
	const NUMBER_OFFSET_Y = SIDE_LENGTH * NUMBER_OFFSET_Y_SCALE;

	const PASTE_AREA_HEIGHT = SIDE_LENGTH * PASTE_AREA_HEIGHT_SCALE;
	const OBLIQUE_LINE = SIDE_LENGTH * OBLIQUE_LINE_SCALE;
	const HOLE_OFFSET = SIDE_LENGTH * HOLE_OFFSET_SCALE;

	const FIXED_PASTE_AREA_END = PASTE_AREA_END || ONE_ROD_SEG;
	const ONE_ROD_WIDTH = SIDE_LENGTH * ONE_ROD_SEG;
	const COL_COUNT = Math.floor(MAX_X / ONE_ROD_WIDTH + (1 / ONE_ROD_SEG));

	const ONE_ROD_HEIGHT = SIDE_LENGTH * 3 + PASTE_AREA_HEIGHT * 2;
	const ROW_COUNT = VERTICAL_OVERLAP ? Math.floor((MAX_Y - PASTE_AREA_HEIGHT) / (ONE_ROD_HEIGHT - PASTE_AREA_HEIGHT)) : Math.floor(MAX_Y / ONE_ROD_HEIGHT);

	const ROD_COUNT_PER_PAGE = ROW_COUNT * COL_COUNT;
	const ROD_COUNT = STYLE_ARRAY.length;
	const PAGE_COUNT = Math.ceil(ROD_COUNT / ROD_COUNT_PER_PAGE);
	// console.log(PAGE_COUNT);

	const APPEND_ONE_COLUMN_COUNT_ARRAY_COUNT = APPEND_ONE_COLUMN_COUNT_ARRAY.length;
	const TEXT_HTML_START = '<text'.concat(' width="', SIDE_LENGTH, 'mm" height="', SIDE_LENGTH, 'mm" x="');
	const TEXT_HTML_END = '</text>';

	const UNDERLINE_HTML = ' text-decoration="underline"';
	const MODEL_NO_CLASS_HTML = ' class="model-no"';

	const NUMBER_Y_OFFSET = SIDE_LENGTH * 0.15;
	const NUMBER_Y_OFFSET_PATCH = SIDE_LENGTH * 0.08;

	let svgHtml = '';

	function drawBigHole(options) {
		const {
			NUMBER_X_START,
			NUMBER_Y_START,
			CIRCLE_STYLE
		} = options;
		const SEG_COUNT = CIRCLE_STYLE.length;

		for (let rowIndex = 0; rowIndex < 3; ++rowIndex) {
			const Y = NUMBER_Y_START + SIDE_LENGTH * rowIndex;
			const DIGIT = CIRCLE_STYLE[rowIndex];

			for (let segIndex = 0; segIndex < SEG_COUNT; ++segIndex) {
				// 注意：javascript没有Math.power，只有Math.pow
				const POWER = Math.pow(2, segIndex);
				// console.log(DIGIT, POWER, DIGIT & POWER, (DIGIT & POWER) === POWER);
				if ((DIGIT & POWER) === POWER) {
					svgHtml += '<circle cx="'.concat(NUMBER_X_START + SIDE_LENGTH * segIndex, 'mm" cy="', Y, 'mm" r="', ARC_RADIUS, 'mm" stroke="black" fill="white" />');
				}
			}
		}
	}

	function drawCoreArea(options) {
		const {
			START_X,
			END_X,
			START_Y,
			ONE_ROD_HEIGHT,
			FIXED_ONE_ROD_SEG,
			IS_LAST_COL,
			REDUCE_LEFT,
			REDUCE_RIGHT
		} = options;
		const {
			REDUCE_LEFT_BY_PAPER_THICKNESS,
			REDUCE_RIGHT_BY_PAPER_THICKNESS
		} = options;
		const END_Y = START_Y + ONE_ROD_HEIGHT;

		const CUT_Y1 = START_Y + PASTE_AREA_HEIGHT;
		const CUT_Y2 = CUT_Y1 + SIDE_LENGTH;
		const CUT_Y3 = CUT_Y2 + SIDE_LENGTH;
		const CUT_Y4 = END_Y - PASTE_AREA_HEIGHT;

		const FIXED_END_X = (REDUCE_RIGHT || REDUCE_RIGHT_BY_PAPER_THICKNESS) ? END_X - PAPER_THICKNESS : END_X;
		const ONE_SIDE_LENGTH_LESS_THAN_END_X = END_X - SIDE_LENGTH;

		if (REDUCE_LEFT) {
			const START_X_SEG2 = START_X + SIDE_LENGTH;
			const FIXED_CUT_Y2 = CUT_Y2 + OBLIQUE_LINE;
			const FIXED_CUT_Y3 = CUT_Y3 - OBLIQUE_LINE;
			const FIXED_START_X = START_X + PAPER_THICKNESS;

			// if (FIXED_ONE_ROD_SEG > 5) {
			// 	// 核心区左纵线
			// 	svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', FIXED_START_X, 'mm" y1="', FIXED_CUT_Y2, 'mm" y2="', FIXED_CUT_Y3, 'mm" />');
			//
			// 	// svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y2, 'mm" y2="', FIXED_CUT_Y2, 'mm" />');
			// 	// svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y3, 'mm" y2="', FIXED_CUT_Y3, 'mm" />');
			//
			// 	// svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y2, 'mm" y2="', CUT_Y2, 'mm" />');
			// 	// svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y3, 'mm" y2="', CUT_Y3, 'mm" />');
			//
			// 	svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y2, 'mm" y2="', CUT_Y2 + PAPER_THICKNESS, 'mm" />');
			// 	svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y3, 'mm" y2="', CUT_Y3 - PAPER_THICKNESS, 'mm" />');
			// } else {
			// 	// 核心区左纵线
			// 	svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', FIXED_START_X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y3, 'mm" />');
			// 	// svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y2, 'mm" />');
			// 	// svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', CUT_Y3, 'mm" y2="', CUT_Y3, 'mm" />');
			// 	svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y2, 'mm" />');
			// 	svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', CUT_Y3, 'mm" y2="', CUT_Y3, 'mm" />');
			// }
			svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', FIXED_START_X, 'mm" y1="', FIXED_CUT_Y2, 'mm" y2="', FIXED_CUT_Y3, 'mm" />');
			svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y2, 'mm" y2="', CUT_Y2 + PAPER_THICKNESS, 'mm" />');
			svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', START_X_SEG2, 'mm" y1="', FIXED_CUT_Y3, 'mm" y2="', CUT_Y3 - PAPER_THICKNESS, 'mm" />');

			// 核心区域上下横线
			// svgHtml += '<line class="inner" x1="'.concat(START_X_SEG2, 'mm" x2="', END_X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y2, 'mm" />');
			// svgHtml += '<line class="inner" x1="'.concat(START_X_SEG2, 'mm" x2="', END_X, 'mm" y1="', CUT_Y3, 'mm" y2="', CUT_Y3, 'mm" />');

			svgHtml += '<line class="inner" x1="'.concat(START_X_SEG2, 'mm" x2="', ONE_SIDE_LENGTH_LESS_THAN_END_X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y2, 'mm" />');
			svgHtml += '<line class="inner" x1="'.concat(START_X_SEG2, 'mm" x2="', ONE_SIDE_LENGTH_LESS_THAN_END_X, 'mm" y1="', CUT_Y3, 'mm" y2="', CUT_Y3, 'mm" />');
		} else {
			const FIXED_START_X = START_X + (REDUCE_LEFT_BY_PAPER_THICKNESS ? PAPER_THICKNESS : 0);
			// 核心区左纵线
			svgHtml += '<line class="outer" x1="'.concat(FIXED_START_X, 'mm" x2="', FIXED_START_X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y3, 'mm" />');

			// 核心区域上下横线
			// svgHtml += '<line class="inner" x1="'.concat(FIXED_START_X, 'mm" x2="', END_X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y2, 'mm" />');
			// svgHtml += '<line class="inner" x1="'.concat(FIXED_START_X, 'mm" x2="', END_X, 'mm" y1="', CUT_Y3, 'mm" y2="', CUT_Y3, 'mm" />');

			svgHtml += '<line class="inner" x1="'.concat(FIXED_START_X, 'mm" x2="', ONE_SIDE_LENGTH_LESS_THAN_END_X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y2, 'mm" />');
			svgHtml += '<line class="inner" x1="'.concat(FIXED_START_X, 'mm" x2="', ONE_SIDE_LENGTH_LESS_THAN_END_X, 'mm" y1="', CUT_Y3, 'mm" y2="', CUT_Y3, 'mm" />');
		}
		// const FIXED_END_X = END_X - (REDUCE_LEFT ? 0 : PAPER_THICKNESS);
		// svgHtml += '<line class="outer" x1="'.concat(FIXED_END_X, 'mm" x2="', FIXED_END_X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y3, 'mm" />');

		const FIXED_RIGHT_CUT_2 = CUT_Y2 + (REDUCE_RIGHT ? PAPER_THICKNESS : 0);
		const FIXED_RIGHT_CUT_3 = CUT_Y3 - (REDUCE_RIGHT ? PAPER_THICKNESS : 0);
		svgHtml += '<line class="outer" x1="'.concat(ONE_SIDE_LENGTH_LESS_THAN_END_X, 'mm" x2="', FIXED_END_X, 'mm" y1="', FIXED_RIGHT_CUT_2, 'mm" y2="', FIXED_RIGHT_CUT_2, 'mm" />');
		svgHtml += '<line class="outer" x1="'.concat(ONE_SIDE_LENGTH_LESS_THAN_END_X, 'mm" x2="', FIXED_END_X, 'mm" y1="', FIXED_RIGHT_CUT_3, 'mm" y2="', FIXED_RIGHT_CUT_3, 'mm" />');
		svgHtml += '<line class="outer" x1="'.concat(FIXED_END_X, 'mm" x2="', FIXED_END_X, 'mm" y1="', FIXED_RIGHT_CUT_2, 'mm" y2="', FIXED_RIGHT_CUT_3, 'mm" />');

		const FIXED_END = FIXED_ONE_ROD_SEG - 1;
		// 核心区其它纵线
		// for (let loopOfVertical = 0; loopOfVertical < FIXED_ONE_ROD_SEG; ++loopOfVertical) {
		// 	const X = START_X + SIDE_LENGTH * (loopOfVertical + 1);
		// 	if (IS_LAST_COL || loopOfVertical < FIXED_ONE_ROD_SEG - 1) {
		// 		svgHtml += '<line class="inner" x1="'.concat(X, 'mm" x2="', X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y3, 'mm" />');
		// 	}
		// }
		for (let loopOfVertical = 0; loopOfVertical < FIXED_END; ++loopOfVertical) {
			const X = START_X + SIDE_LENGTH * (loopOfVertical + 1);
			svgHtml += '<line class="inner" x1="'.concat(X, 'mm" x2="', X, 'mm" y1="', CUT_Y2, 'mm" y2="', CUT_Y3, 'mm" />');
		}
	}

	function drawGuides(options) {
		const {
			TRUE_MAX_X,
			TRUE_MAX_Y,
			ROW_COUNT,
			APPEND_ONE_COLUMN_COUNT
		} = options;

		// // 最外面两横线
		// svgHtml += '<line class="outer" x1="'.concat(0, 'mm" x2="', TRUE_MAX_X, 'mm" y1="', 0, 'mm" y2="', 0, 'mm" />');
		// svgHtml += '<line class="outer" x1="'.concat(0, 'mm" x2="', TRUE_MAX_X, 'mm" y1="', TRUE_MAX_Y, 'mm" y2="', TRUE_MAX_Y, 'mm" />');

		const FIXED_TRUE_MAX_X = APPEND_ONE_COLUMN_COUNT * SIDE_LENGTH + TRUE_MAX_X;
		const FIXED_TRUE_MAX_Y = TRUE_MAX_Y - (VERTICAL_OVERLAP ? PASTE_AREA_HEIGHT * (ROW_COUNT - 1) : 0);
		if (!HIDE_BELOW_HORIZONTAL_LINE) {
			// 底部加一些线
			const HORIZONTAL_LINE_COUNT = Math.floor((MAX_Y - FIXED_TRUE_MAX_Y) / SIDE_LENGTH);
			if (HORIZONTAL_LINE_COUNT) {
				const HORIZONTAL_LINE_END_X = Math.floor(MAX_X / SIDE_LENGTH) * SIDE_LENGTH;
				for (let i = 0; i <= HORIZONTAL_LINE_COUNT; ++i) {
					const Y = FIXED_TRUE_MAX_Y + SIDE_LENGTH * i;
					// console.log(i , MAX_X, Y);
					svgHtml += '<line class="inner" x1="'.concat(0, 'mm" x2="', HORIZONTAL_LINE_END_X, 'mm" y1="', Y, 'mm" y2="', Y, 'mm" />');
				}
			}
			// const HORIZONTAL_OTHER_LINE_COUNT = Math.floor(FIXED_TRUE_MAX_X / SIDE_LENGTH);
			const HORIZONTAL_OTHER_LINE_COUNT = Math.floor(MAX_X / SIDE_LENGTH);
			const HORIZONTAL_OTHER_LINE_END_Y = FIXED_TRUE_MAX_Y + Math.floor((MAX_Y - FIXED_TRUE_MAX_Y) / SIDE_LENGTH) * SIDE_LENGTH;
			for (let i = 0; i <= HORIZONTAL_OTHER_LINE_COUNT; ++i) {
				const X = SIDE_LENGTH * i;
				svgHtml += '<line class="inner" x1="'.concat(X, 'mm" x2="', X, 'mm" y1="', FIXED_TRUE_MAX_Y, 'mm" y2="', HORIZONTAL_OTHER_LINE_END_Y, 'mm" />');
			}
		}

		if (!HIDE_RIGHT_VERTICAL_LINE) {
			// 右侧加一些线
			const VERTICAL_LINE_COUNT = Math.floor((MAX_X - FIXED_TRUE_MAX_X) / SIDE_LENGTH);
			if (VERTICAL_LINE_COUNT > 0) {
				const VERTICAL_LINE_END_Y = FIXED_TRUE_MAX_Y + (!HIDE_BELOW_HORIZONTAL_LINE ? 0 : Math.floor((MAX_Y - FIXED_TRUE_MAX_Y) / SIDE_LENGTH) * SIDE_LENGTH);
				for (let i = 0; i <= VERTICAL_LINE_COUNT; ++i) {
					const X = FIXED_TRUE_MAX_X + SIDE_LENGTH * i;
					svgHtml += '<line class="inner" x1="'.concat(X, 'mm" x2="', X, 'mm" y1="', 0, 'mm" y2="', VERTICAL_LINE_END_Y, 'mm" />');
				}
			}
			const VERTICAL_OTHER_LINE_COUNT = Math.floor(FIXED_TRUE_MAX_Y / SIDE_LENGTH);
			const VERTICAL_OTHER_LINE_END_X = FIXED_TRUE_MAX_X + Math.floor((MAX_X - FIXED_TRUE_MAX_X) / SIDE_LENGTH) * SIDE_LENGTH;
			for (let i = 0; i <= VERTICAL_OTHER_LINE_COUNT; ++i) {
				const Y = SIDE_LENGTH * i - (SIDE_LENGTH - PASTE_AREA_HEIGHT) * ((i % 5 === 0 ? 0 : 1) + 2 * Math.floor(i / 5));
				svgHtml += '<line class="inner" x1="'.concat(FIXED_TRUE_MAX_X, 'mm" x2="', VERTICAL_OTHER_LINE_END_X, 'mm" y1="', Y, 'mm" y2="', Y, 'mm" />');
			}
		}
	}

	function drawBranchArea(options) {
		const {
			BRANCH_STYLE,
			X1,
			X2,
			X3,
			X4,
			NEAREST_Y,
			MIDDLE_Y,
			FARTHEST_Y,
			IS_ABOVE
		} = options;
		const FIX_Y_BY_PAPER = PAPER_THICKNESS * (IS_ABOVE ? 1 : -1);

		if (BRANCH_STYLE !== BranchStyle.None) {
			// 先处理第一段
			let seg1Left = X1,
				seg1Right = X4;
			switch (BRANCH_STYLE) {
				case BranchStyle.OneSegCutLeft: // 2,
					seg1Left = X2;
					seg1Right = X4 - PAPER_THICKNESS;
					break;
				case BranchStyle.OneSegCutRight: // 3,
					seg1Right = X3;
					seg1Left = X1 + PAPER_THICKNESS;
					break;
				case BranchStyle.OneSegCutBoth: // 4,
					seg1Left = X2;
					seg1Right = X3;
					break;

				case BranchStyle.OneSegCutNone: // 1,
					seg1Left = X1 + PAPER_THICKNESS;
					seg1Right = X4 - PAPER_THICKNESS;

					seg1FixY = false;
					break;
					// 其余情况都不处理
				default:
					seg1FixY = false;
					break;
			}
			if (BRANCH_STYLE <= BranchStyle.OneSegCutBoth) {
				const FIXED_MIDDLE_Y = MIDDLE_Y + FIX_Y_BY_PAPER;
				svgHtml += '<line class="outer" x1="'.concat(seg1Left, 'mm" x2="', seg1Right, 'mm" y1="', FIXED_MIDDLE_Y, 'mm" y2="', FIXED_MIDDLE_Y, 'mm" />');
				svgHtml += '<line class="outer" x1="'.concat(X1 + PAPER_THICKNESS, 'mm" x2="', seg1Left, 'mm" y1="', NEAREST_Y, 'mm" y2="', FIXED_MIDDLE_Y, 'mm" />');
				svgHtml += '<line class="outer" x1="'.concat(seg1Right, 'mm" x2="', X4 - PAPER_THICKNESS, 'mm" y1="', FIXED_MIDDLE_Y, 'mm" y2="', NEAREST_Y, 'mm" />');
			} else {
				svgHtml += '<line class="inner" x1="'.concat(seg1Left, 'mm" x2="', seg1Right, 'mm" y1="', MIDDLE_Y, 'mm" y2="', MIDDLE_Y, 'mm" />');
				svgHtml += '<line class="inner" x1="'.concat(X1, 'mm" x2="', seg1Left, 'mm" y1="', NEAREST_Y, 'mm" y2="', MIDDLE_Y, 'mm" />');
				svgHtml += '<line class="inner" x1="'.concat(seg1Right, 'mm" x2="', X4, 'mm" y1="', MIDDLE_Y, 'mm" y2="', NEAREST_Y, 'mm" />');
			}

			// 再处理第二段
			if (BRANCH_STYLE > BranchStyle.OneSegCutBoth) {
				seg2Left = X1 + PAPER_THICKNESS, seg2Right = X4 - PAPER_THICKNESS, seg2FixY = true;
				switch (BRANCH_STYLE) {
					case BranchStyle.TwoSegsCutLeft: // 6,
						seg2Left = X2;
						break;
					case BranchStyle.TwoSegsCutRight: // 7,
						seg2Right = X3;
						break;
					case BranchStyle.TwoSegsCutBoth: // 8,
						seg2Left = X2;
						seg2Right = X3;
						break;

						// 其余情况都不处理
					default:
						seg2FixY = false;
						break;
				}

				const FIXED_FARTHEST_Y = FARTHEST_Y + FIX_Y_BY_PAPER;
				svgHtml += '<line class="outer" x1="'.concat(seg2Left, 'mm" x2="', seg2Right, 'mm" y1="', FIXED_FARTHEST_Y, 'mm" y2="', FIXED_FARTHEST_Y, 'mm" />');
				svgHtml += '<line class="outer" x1="'.concat(X1 + PAPER_THICKNESS, 'mm" x2="', seg2Left, 'mm" y1="', MIDDLE_Y, 'mm" y2="', FIXED_FARTHEST_Y, 'mm" />');
				svgHtml += '<line class="outer" x1="'.concat(seg2Right, 'mm" x2="', X4 - PAPER_THICKNESS, 'mm" y1="', FIXED_FARTHEST_Y, 'mm" y2="', MIDDLE_Y, 'mm" />');
			}
		}
	}

	let rodIndex = -1;
	let pageIndex = -1;

	function countSvgHtml() {
		svgHtml = '';
		++pageIndex;

		const APPEND_ONE_COLUMN_COUNT = pageIndex < APPEND_ONE_COLUMN_COUNT_ARRAY_COUNT ? APPEND_ONE_COLUMN_COUNT_ARRAY[pageIndex] : DEFAULT_APPEND_ONE_COLUMN_COUNT;
		const COL_INDEX_OF_FIRST_APPEND_ONE_COLUMN = COL_COUNT - APPEND_ONE_COLUMN_COUNT;
		// console.log(COL_COUNT, COL_INDEX_OF_FIRST_APPEND_ONE_COLUMN, APPEND_ONE_COLUMN_COUNT);

		for (let colIndex = 0; colIndex < COL_COUNT; ++colIndex) {
			const IS_LAST_COL = colIndex === COL_COUNT - 1;
			const NEED_APPEND_ONE_COLUMN = colIndex >= COL_INDEX_OF_FIRST_APPEND_ONE_COLUMN;
			const FIXED_ONE_ROD_SEG = (NEED_APPEND_ONE_COLUMN ? 1 : 0) + ONE_ROD_SEG;

			const START_X = ONE_ROD_WIDTH * colIndex + (colIndex > COL_INDEX_OF_FIRST_APPEND_ONE_COLUMN ? SIDE_LENGTH * (colIndex - COL_INDEX_OF_FIRST_APPEND_ONE_COLUMN) : 0);
			const END_X = START_X + ONE_ROD_WIDTH + (NEED_APPEND_ONE_COLUMN ? SIDE_LENGTH : 0);

			const NUMBER_X_START = START_X + NUMBER_OFFSET_X;
			let numberY = 0;
			for (let loopOfRow = 0; loopOfRow < ROW_COUNT; ++loopOfRow) {
				++rodIndex;

				const ROD_STYLE_ARRAY = rodIndex < ROD_COUNT ? STYLE_ARRAY[rodIndex] : DEFAULT_ROD_STYLE_ARRAY;
				const ABOVE_ROD_BRANCH_STYLE_ARRAY = ROD_STYLE_ARRAY[0];
				const BELOW_ROD_BRANCH_STYLE_ARRAY = ROD_STYLE_ARRAY[1];
				const CIRCLE_STYLE = ROD_STYLE_ARRAY[2];
				const MODEL_NO = 'M'.concat(ROD_STYLE_ARRAY[3][0].toString());
				const ROD_INDEX = (START_ROD_INDEX + rodIndex).toString();

				const START_Y = ONE_ROD_HEIGHT * loopOfRow - (VERTICAL_OVERLAP ? PASTE_AREA_HEIGHT * loopOfRow : 0);
				const END_Y = START_Y + ONE_ROD_HEIGHT;

				const CUT_Y1 = START_Y + PASTE_AREA_HEIGHT;
				const CUT_Y2 = CUT_Y1 + SIDE_LENGTH;
				const CUT_Y4 = END_Y - PASTE_AREA_HEIGHT;
				const CUT_Y3 = CUT_Y4 - SIDE_LENGTH;

				const FIRST_SEG_ABOVE_BRANCH_STYLE = ABOVE_ROD_BRANCH_STYLE_ARRAY[0];
				const FIRST_SEG_BELOW_BRANCH_STYLE = BELOW_ROD_BRANCH_STYLE_ARRAY[0];
				const REDUCE_LEFT = (FIRST_SEG_ABOVE_BRANCH_STYLE === BranchStyle.None) && (FIRST_SEG_BELOW_BRANCH_STYLE === BranchStyle.None);

				const SEG_MAX_INDEX = Math.max(FIXED_PASTE_AREA_END, FIXED_ONE_ROD_SEG) - 1;

				const PASTE_AREA_END_MAX_INDEX = FIXED_PASTE_AREA_END - 1;
				const LAST_INDEX_IS_INVALID = NEED_APPEND_ONE_COLUMN && (!REDUCE_LEFT && SEG_MAX_INDEX === FIXED_ONE_ROD_SEG - 1);
				const LAST_SEG_ABOVE_BRANCH_STYLE = LAST_INDEX_IS_INVALID ? BranchStyle.None : (ABOVE_ROD_BRANCH_STYLE_ARRAY[Math.min(PASTE_AREA_END_MAX_INDEX, ABOVE_ROD_BRANCH_STYLE_ARRAY.length - 1)]);
				const LAST_SEG_BELOW_BRANCH_STYLE = LAST_INDEX_IS_INVALID ? BranchStyle.None : (BELOW_ROD_BRANCH_STYLE_ARRAY[Math.min(PASTE_AREA_END_MAX_INDEX, BELOW_ROD_BRANCH_STYLE_ARRAY.length - 1)]);
				const REDUCE_RIGHT = (LAST_SEG_ABOVE_BRANCH_STYLE === BranchStyle.None) && (LAST_SEG_BELOW_BRANCH_STYLE === BranchStyle.None);
				// console.log(LAST_SEG_ABOVE_BRANCH_STYLE, LAST_SEG_BELOW_BRANCH_STYLE, REDUCE_RIGHT);

				const REDUCE_LEFT_BY_PAPER_THICKNESS = !REDUCE_LEFT && (LAST_SEG_ABOVE_BRANCH_STYLE > BranchStyle.OneSegCutBoth && LAST_SEG_BELOW_BRANCH_STYLE > BranchStyle.OneSegCutBoth);
				const REDUCE_RIGHT_BY_PAPER_THICKNESS = !REDUCE_RIGHT && !(LAST_SEG_ABOVE_BRANCH_STYLE > BranchStyle.OneSegCutBoth && LAST_SEG_BELOW_BRANCH_STYLE > BranchStyle.OneSegCutBoth) && (FIRST_SEG_ABOVE_BRANCH_STYLE > BranchStyle.None || FIRST_SEG_BELOW_BRANCH_STYLE > BranchStyle.None);

				// 绘制大孔
				drawBigHole({
					NUMBER_X_START,
					NUMBER_Y_START: START_Y + PASTE_AREA_HEIGHT + SIDE_LENGTH * 0.5,
					CIRCLE_STYLE
				});

				drawCoreArea({
					START_X,
					END_X,
					START_Y,
					ONE_ROD_HEIGHT,
					FIXED_ONE_ROD_SEG,
					IS_LAST_COL,
					REDUCE_LEFT,
					REDUCE_RIGHT,
					REDUCE_LEFT_BY_PAPER_THICKNESS,
					REDUCE_RIGHT_BY_PAPER_THICKNESS
				});

				// WITH_INNER_ROD代码接入口

				let SEG_INDEX_OF_MODEL_NO = -1;
				let SEG_INDEX_OF_ROD_INDEX = -1;
				// SHOW_INDEX

				// for(let segIndex = 0; segIndex < FIXED_ONE_ROD_SEG; ++segIndex) {
				// for(let segIndex = PASTE_AREA_START; segIndex <= SEG_MAX_INDEX; ++segIndex) {
				for (let segIndex = 0; segIndex <= SEG_MAX_INDEX; ++segIndex) {
					const X1 = START_X + SIDE_LENGTH * segIndex,
						X4 = X1 + SIDE_LENGTH;
					const X2 = X1 + OBLIQUE_LINE,
						X3 = X4 - OBLIQUE_LINE;

					const ABOVE_BRANCH_STYLE_ARRAY = ABOVE_ROD_BRANCH_STYLE_ARRAY[segIndex];
					const BELOW_BRANCH_STYLE_ARRAY = BELOW_ROD_BRANCH_STYLE_ARRAY[segIndex];

					if (SEG_INDEX_OF_MODEL_NO === -1 && ABOVE_BRANCH_STYLE_ARRAY > BranchStyle.OneSegCutBoth) {
						SEG_INDEX_OF_MODEL_NO = segIndex;
					}

					if (SEG_INDEX_OF_ROD_INDEX === -1 && BELOW_BRANCH_STYLE_ARRAY > BranchStyle.OneSegCutBoth) {
						SEG_INDEX_OF_ROD_INDEX = segIndex;
					}

					// if ((ABOVE_BRANCH_STYLE_ARRAY === BranchStyle.None && BELOW_BRANCH_STYLE_ARRAY === BranchStyle.None) && (segIndex === 0 || segIndex === SEG_MAX_INDEX)) {
					// 	// 绘制横向粘贴区的三条线
					// 	if (segIndex === 0) {
					// 		const LEFT_X = X1 + PAPER_THICKNESS;
					// 		const RIGHT_X = X1 + SIDE_LENGTH;
					// 		const LEFT_Y1 = CUT_Y2 + OBLIQUE_LINE;
					// 		const LEFT_Y2 = CUT_Y3 - OBLIQUE_LINE;
					// 		const RIGHT_Y1 = CUT_Y2 + PAPER_THICKNESS;
					// 		const RIGHT_Y2 = CUT_Y3 - PAPER_THICKNESS;
					//
					// 		svgHtml += '<line class="inner" x1="'.concat(LEFT_X, 'mm" x2="', LEFT_X, 'mm" y1="', LEFT_Y1, 'mm" y2="', LEFT_Y2, 'mm" />');
					//
					// 		svgHtml += '<line class="inner" x1="'.concat(LEFT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', LEFT_Y1, 'mm" y2="', RIGHT_Y1, 'mm" />');
					// 		svgHtml += '<line class="inner" x1="'.concat(LEFT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', LEFT_Y2, 'mm" y2="', RIGHT_Y2, 'mm" />');
					// 	} else {
					// 		const LEFT_X = X4 - SIDE_LENGTH;
					// 		const RIGHT_X = X4 - PAPER_THICKNESS;
					// 		const LEFT_Y1 = CUT_Y2 + PAPER_THICKNESS;
					// 		const LEFT_Y2 = CUT_Y3 - PAPER_THICKNESS;
					// 		const RIGHT_Y1 = CUT_Y2 + OBLIQUE_LINE;
					// 		const RIGHT_Y2 = CUT_Y3 - OBLIQUE_LINE;
					//
					// 		svgHtml += '<line class="inner" x1="'.concat(RIGHT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', RIGHT_Y1, 'mm" y2="', RIGHT_Y2, 'mm" />');
					//
					// 		svgHtml += '<line class="inner" x1="'.concat(LEFT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', LEFT_Y1, 'mm" y2="', RIGHT_Y1, 'mm" />');
					// 		svgHtml += '<line class="inner" x1="'.concat(LEFT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', LEFT_Y2, 'mm" y2="', RIGHT_Y2, 'mm" />');
					// 	}
					// }

					// 左线已处理，这里仅处理右线。右线两个风格：本正方体内部粘贴区、插入其它正方体粘贴区。这里绘制后者。
					if ((ABOVE_BRANCH_STYLE_ARRAY === BranchStyle.None && BELOW_BRANCH_STYLE_ARRAY === BranchStyle.None) && (segIndex === SEG_MAX_INDEX)) {
						// 绘制横向粘贴区的三条线
						const LEFT_X = X4 - SIDE_LENGTH;
						const RIGHT_X = X4 - PAPER_THICKNESS;
						const LEFT_Y1 = CUT_Y2 + PAPER_THICKNESS;
						const LEFT_Y2 = CUT_Y3 - PAPER_THICKNESS;
						const RIGHT_Y1 = CUT_Y2 + OBLIQUE_LINE;
						const RIGHT_Y2 = CUT_Y3 - OBLIQUE_LINE;

						svgHtml += '<line class="inner" x1="'.concat(RIGHT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', RIGHT_Y1, 'mm" y2="', RIGHT_Y2, 'mm" />');

						svgHtml += '<line class="inner" x1="'.concat(LEFT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', LEFT_Y1, 'mm" y2="', RIGHT_Y1, 'mm" />');
						svgHtml += '<line class="inner" x1="'.concat(LEFT_X, 'mm" x2="', RIGHT_X, 'mm" y1="', LEFT_Y2, 'mm" y2="', RIGHT_Y2, 'mm" />');
					}
					if (segIndex < PASTE_AREA_START) {
						continue;
					}

					// 处理核心区域以上部分
					drawBranchArea({
						BRANCH_STYLE: ABOVE_BRANCH_STYLE_ARRAY,
						X1,
						X2,
						X3,
						X4,
						NEAREST_Y: CUT_Y2,
						MIDDLE_Y: CUT_Y1,
						FARTHEST_Y: START_Y,
						IS_ABOVE: true
					});

					// 处理核心区域以下部分
					drawBranchArea({
						BRANCH_STYLE: BELOW_BRANCH_STYLE_ARRAY,
						X1,
						X2,
						X3,
						X4,
						NEAREST_Y: CUT_Y3,
						MIDDLE_Y: CUT_Y4,
						FARTHEST_Y: END_Y,
						IS_ABOVE: false
					});
				}

				const MODEL_NO_UNDERLINE_HTML = (MODEL_NO.indexOf('6') > -1 || MODEL_NO.indexOf('9') > -1) ? UNDERLINE_HTML : '';
				const MODEL_NO_HTML_END = 'mm" fill="'.concat(TOP_OR_BOTTOM_TEXT_COLOR, '"', MODEL_NO_CLASS_HTML, MODEL_NO_UNDERLINE_HTML, '>', MODEL_NO, TEXT_HTML_END);

				const ROD_INDEX_UNDERLINE_HTML = (ROD_INDEX.indexOf('6') > -1 || ROD_INDEX.indexOf('9') > -1) ? UNDERLINE_HTML : '';
				const ROD_INDEX_HTML_MIDDLE = 'mm" fill="'.concat(TOP_OR_BOTTOM_TEXT_COLOR, '"', ROD_INDEX_UNDERLINE_HTML, '>'); // , ROD_INDEX, TEXT_HTML_END);
				if (SHOW_FACE_NO) {
					const MODEL_NO_Y1 = START_Y + NUMBER_Y_OFFSET;
					const MODEL_NO_Y2 = CUT_Y1 + NUMBER_Y_OFFSET;
					const MODEL_NO_Y3 = CUT_Y2 + NUMBER_Y_OFFSET;
					const MODEL_NO_Y4 = CUT_Y3 + NUMBER_Y_OFFSET;
					const MODEL_NO_Y5 = CUT_Y4 + NUMBER_Y_OFFSET;

					const ROD_INDEX_Y1 = CUT_Y1 - NUMBER_Y_OFFSET;
					const ROD_INDEX_Y2 = CUT_Y2 - NUMBER_Y_OFFSET;
					const ROD_INDEX_Y3 = CUT_Y3 - NUMBER_Y_OFFSET;
					const ROD_INDEX_Y4 = CUT_Y4 - NUMBER_Y_OFFSET;
					const ROD_INDEX_Y5 = END_Y - NUMBER_Y_OFFSET;

					let faceIndex = -1;
					for (let segIndex = 0; segIndex <= SEG_MAX_INDEX; ++segIndex) {
						const ABOVE_BRANCH_STYLE_ARRAY = ABOVE_ROD_BRANCH_STYLE_ARRAY[segIndex];
						const BELOW_BRANCH_STYLE_ARRAY = BELOW_ROD_BRANCH_STYLE_ARRAY[segIndex];

						const NUMBER_X = (NUMBER_X_START + SIDE_LENGTH * segIndex).toString();
						if (ABOVE_BRANCH_STYLE_ARRAY > BranchStyle.OneSegCutBoth) {
							++faceIndex;
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', MODEL_NO_Y1, MODEL_NO_HTML_END);
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', ROD_INDEX_Y1, ROD_INDEX_HTML_MIDDLE, ROD_INDEX, FACE_NAME_ARRAY[faceIndex], TEXT_HTML_END);
						}
						if (ABOVE_BRANCH_STYLE_ARRAY) {
							++faceIndex;
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', MODEL_NO_Y2, MODEL_NO_HTML_END);
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', ROD_INDEX_Y2, ROD_INDEX_HTML_MIDDLE, ROD_INDEX, FACE_NAME_ARRAY[faceIndex], TEXT_HTML_END);
						}

						++faceIndex;
						if ((ABOVE_BRANCH_STYLE_ARRAY === BranchStyle.None && BELOW_BRANCH_STYLE_ARRAY === BranchStyle.None) && (segIndex === 0 || segIndex === SEG_MAX_INDEX)) {
							if (segIndex === 0) {
								svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', MODEL_NO_Y3 + NUMBER_Y_OFFSET_PATCH, 'mm" fill="'.concat(TOP_OR_BOTTOM_TEXT_COLOR, '"', MODEL_NO_CLASS_HTML, MODEL_NO_UNDERLINE_HTML, TEXT_RIGHT_ALIGNMENT, '>', MODEL_NO, TEXT_HTML_END));
								svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', ROD_INDEX_Y3 - NUMBER_Y_OFFSET_PATCH, 'mm" fill="'.concat(TOP_OR_BOTTOM_TEXT_COLOR, '"', ROD_INDEX_UNDERLINE_HTML, TEXT_RIGHT_ALIGNMENT, '>'), ROD_INDEX, FACE_NAME_ARRAY[faceIndex], TEXT_HTML_END);
							} else {
								svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', MODEL_NO_Y3 + NUMBER_Y_OFFSET_PATCH, 'mm" fill="'.concat(TOP_OR_BOTTOM_TEXT_COLOR, '"', MODEL_NO_CLASS_HTML, MODEL_NO_UNDERLINE_HTML, TEXT_LEFT_ALIGNMENT, '>', MODEL_NO, TEXT_HTML_END));
								svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', ROD_INDEX_Y3 - NUMBER_Y_OFFSET_PATCH, 'mm" fill="'.concat(TOP_OR_BOTTOM_TEXT_COLOR, '"', ROD_INDEX_UNDERLINE_HTML, TEXT_LEFT_ALIGNMENT, '>'), ROD_INDEX, FACE_NAME_ARRAY[faceIndex], TEXT_HTML_END);
							}
						} else {
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', MODEL_NO_Y3, MODEL_NO_HTML_END);
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', ROD_INDEX_Y3, ROD_INDEX_HTML_MIDDLE, ROD_INDEX, FACE_NAME_ARRAY[faceIndex], TEXT_HTML_END);
						}

						if (BELOW_BRANCH_STYLE_ARRAY) {
							++faceIndex;
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', MODEL_NO_Y4, MODEL_NO_HTML_END);
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', ROD_INDEX_Y4, ROD_INDEX_HTML_MIDDLE, ROD_INDEX, FACE_NAME_ARRAY[faceIndex], TEXT_HTML_END);
						}
						if (BELOW_BRANCH_STYLE_ARRAY > BranchStyle.OneSegCutBoth) {
							++faceIndex;
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', MODEL_NO_Y5, MODEL_NO_HTML_END);
							svgHtml += TEXT_HTML_START.concat(NUMBER_X, 'mm" y="', ROD_INDEX_Y5, ROD_INDEX_HTML_MIDDLE, ROD_INDEX, FACE_NAME_ARRAY[faceIndex], TEXT_HTML_END);
						}
					}
				} else {
					if (SHOW_MODEL_NO) {
						const MODEL_NO_Y1 = CUT_Y1 + NUMBER_Y_OFFSET;
						const MODEL_NO_Y2 = CUT_Y4 - NUMBER_Y_OFFSET;

						svgHtml += TEXT_HTML_START;
						if (SEG_INDEX_OF_MODEL_NO === -1) {
							// svgHtml += ''.concat(NUMBER_X_START.toString(), 'mm" y="', CUT_Y1 + NUMBER_Y_OFFSET);
							svgHtml += ''.concat(NUMBER_X_START.toString(), 'mm" y="', MODEL_NO_Y1);
						} else {
							// svgHtml += ''.concat((NUMBER_X_START + SIDE_LENGTH * SEG_INDEX_OF_MODEL_NO).toString(), 'mm" y="', START_Y + NUMBER_Y_OFFSET);
							svgHtml += ''.concat((NUMBER_X_START + SIDE_LENGTH * SEG_INDEX_OF_MODEL_NO).toString(), 'mm" y="', MODEL_NO_Y1);
						}
						svgHtml += MODEL_NO_HTML_END;

						svgHtml += TEXT_HTML_START;
						if (SEG_INDEX_OF_ROD_INDEX === -1) {
							svgHtml += ''.concat(NUMBER_X_START.toString(), 'mm" y="', MODEL_NO_Y2);
						} else {
							svgHtml += ''.concat((NUMBER_X_START + SIDE_LENGTH * SEG_INDEX_OF_ROD_INDEX).toString(), 'mm" y="', MODEL_NO_Y2);
						}
						svgHtml += MODEL_NO_HTML_END;
					}

					if (SHOW_ROD_INDEX) {
						const SEG_INDEX_Y1 = CUT_Y3 + NUMBER_Y_OFFSET;
						const SEG_INDEX_Y2 = CUT_Y2 - NUMBER_Y_OFFSET;
						svgHtml += TEXT_HTML_START;
						if (SEG_INDEX_OF_ROD_INDEX === -1) {
							svgHtml += ''.concat(NUMBER_X_START.toString(), 'mm" y="', SEG_INDEX_Y1);
						} else {
							svgHtml += ''.concat((NUMBER_X_START + SIDE_LENGTH * SEG_INDEX_OF_ROD_INDEX).toString(), 'mm" y="', SEG_INDEX_Y1);
						}
						svgHtml += ROD_INDEX_HTML_MIDDLE;

						svgHtml += TEXT_HTML_START;
						if (SEG_INDEX_OF_MODEL_NO === -1) {
							svgHtml += ''.concat(NUMBER_X_START.toString(), 'mm" y="', SEG_INDEX_Y2);
						} else {
							svgHtml += ''.concat((NUMBER_X_START + SIDE_LENGTH * SEG_INDEX_OF_MODEL_NO).toString(), 'mm" y="', SEG_INDEX_Y2);
						}
						svgHtml += ROD_INDEX_HTML_MIDDLE;
					}
				}
			}
		}

		const TRUE_MAX_X = ONE_ROD_WIDTH * COL_COUNT;
		const TRUE_MAX_Y = ONE_ROD_HEIGHT * ROW_COUNT;
		// alert(TRUE_MAX_X + ',' + TRUE_MAX_Y);
		drawGuides({
			TRUE_MAX_X,
			TRUE_MAX_Y,
			ROW_COUNT,
			APPEND_ONE_COLUMN_COUNT
		});

		// 因改为多页，不再使用下一句
		// document.getElementById('svg').innerHTML = svgHtml;
		return svgHtml;
	}

	let bodyHtml = '';
	for (let pageIndex = 0; pageIndex < PAGE_COUNT; ++pageIndex) {
		bodyHtml += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg">'.concat(countSvgHtml(), '</svg>');
	}

	// console.log(bodyHtml);
	document.getElementsByTagName('body')[0].innerHTML = bodyHtml;

	// window.print();
}