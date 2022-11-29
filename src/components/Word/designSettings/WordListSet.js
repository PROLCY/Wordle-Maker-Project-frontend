export const oneLine = { // 한 줄 wordList(닉네임 입력 시, 정답 단어 입력 시)
    height: '82.5px',
    rows: 'repeat(1, 1fr)',
    gap: '155px',
    array: [0],
}

export const sixLines = { // 6줄 wordList(SolverPage에서 wordle을 풀 시)
    height: '420px',
    rows: 'repeat(6, 1fr)',
    gap: '5px',
    array: [0, 1, 2, 3, 4, 5],
}

export const sevenLines = { // 7줄 wordList(LoadPage에서 닉네임(1줄) + 입력한 단어 리스트(6줄) 렌더링 시)
    height: '487.5px',
    rows: 'repeat(7, 1fr)',
    gap: '5px',
    array: [0, 1, 2, 3, 4, 5, 6],
}