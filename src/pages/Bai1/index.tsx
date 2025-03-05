import React, { useState } from 'react';
import { Button, Card, List, Typography, message } from 'antd';

const choices = ['Kéo', 'Búa', 'Bao'];

type Result = 'Thắng' | 'Thua' | 'Hòa';

type GameHistory = {
	playerChoice: string;
	computerChoice: string;
	result: Result;
};

const getResult = (player: string, computer: string): Result => {
	if (player === computer) return 'Hòa';
	if (
		(player === 'Kéo' && computer === 'Bao') ||
		(player === 'Búa' && computer === 'Kéo') ||
		(player === 'Bao' && computer === 'Búa')
	) {
		return 'Thắng';
	}
	return 'Thua';
};

const RockPaperScissors: React.FC = () => {
	const [history, setHistory] = useState<GameHistory[]>([]);

	const playGame = (playerChoice: string) => {
		const computerChoice = choices[Math.floor(Math.random() * choices.length)];
		const result = getResult(playerChoice, computerChoice);

		setHistory([...history, { playerChoice, computerChoice, result }]);
		message.info(`Bạn chọn ${playerChoice}, Máy chọn ${computerChoice}. Kết quả: ${result}`);
	};

	return (
		<Card title='Trò chơi Kéo, Búa, Bao' style={{ maxWidth: 400, margin: 'auto' }}>
			<div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
				{choices.map((choice) => (
					<Button key={choice} type='primary' onClick={() => playGame(choice)}>
						{choice}
					</Button>
				))}
			</div>
			<Typography.Title level={4}>Lịch sử:</Typography.Title>
			<List
				bordered
				dataSource={history}
				renderItem={(item, index) => (
					<List.Item>
						Ván {index + 1}: Bạn chọn {item.playerChoice}, Máy chọn {item.computerChoice} - {item.result}
					</List.Item>
				)}
			/>
		</Card>
	);
};

export default RockPaperScissors;
