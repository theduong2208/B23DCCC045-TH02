// import React, { useState, useEffect } from 'react';
// import {
//   Layout,
//   Card,
//   Input,
//   Button,

//   Typography,
//   Progress,
//   Statistic,
//   Row,
//   Col,
//   Modal,
//   Result,
//   Tag
// } from 'antd';
// import {
//   ReloadOutlined,
//   TrophyOutlined,
//   ArrowUpOutlined,
//   ArrowDownOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined
// } from '@ant-design/icons';

// const { Header, Content } = Layout;
// const { Title, Text } = Typography;

// const NumberGuessingGame: React.FC = () => {
//   const [targetNumber, setTargetNumber] = useState<number>(0);
//   const [guess, setGuess] = useState<string>('');
//   const [remainingAttempts, setRemainingAttempts] = useState<number>(10);
//   const [gameOver, setGameOver] = useState<boolean>(false);
//   const [hasWon, setHasWon] = useState<boolean>(false);
//   const [guessHistory, setGuessHistory] = useState<Array<{guess: number, message: string, type: string}>>([]);
//   const [bestScore, setBestScore] = useState<number>(10);
//   const [message, setMessage] = useState<Doanso.GameMessage| null>(null);

//   const initializeGame = () => {
//     setTargetNumber(Math.floor(Math.random() * 100) + 1);
//     setRemainingAttempts(10);
//     setGuess('');
//     setGameOver(false);
//     setHasWon(false);
//     setGuessHistory([]);
//     setMessage({
//       type: 'warning',
//       title: 'Game mới bắt đầu!',
//       description: 'Hãy đoán một số từ 1 đến 100.',
//       icon: <CheckCircleOutlined style={{ color: '#faad14', fontSize: '32px' }} />
//     });
//   };

//   useEffect(() => {
//     initializeGame();
//   }, []);

//   const showMessage = (gameMessage: Doanso.GameMessage) => {
//     setMessage(gameMessage);
//   };

//   const handleGuess = () => {
//     const guessNumber = parseInt(guess);

//     if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
//       showMessage({
//         type: 'error',
//         title: 'Số không hợp lệ',
//         description: 'Vui lòng nhập một số từ 1 đến 100!',
//         icon: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '32px' }} />
//       });
//       return;
//     }

//     const newRemainingAttempts = remainingAttempts - 1;
//     setRemainingAttempts(newRemainingAttempts);

//     let newMessage: Doanso.GameMessage;
//     let messageType = '';

//     if (guessNumber === targetNumber) {
//       newMessage = {
//         type: 'success',
//         title: 'Chiến thắng!',
//         description: `Chúc mừng! Bạn đã đoán đúng số ${targetNumber}!`,
//         icon: <TrophyOutlined style={{ color: '#52c41a', fontSize: '32px' }} />
//       };
//       messageType = 'success';
//       setGameOver(true);
//       setHasWon(true);
//       if (10 - newRemainingAttempts < bestScore) {
//         setBestScore(10 - newRemainingAttempts);
//       }
//     } else if (newRemainingAttempts === 0) {
//       newMessage = {
//         type: 'error',
//         title: 'Game Over!',
//         description: `Số đúng là ${targetNumber}.`,
//         icon: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '32px' }} />
//       };
//       messageType = 'error';
//       setGameOver(true);
//     } else if (guessNumber < targetNumber) {
//       newMessage = {
//         type: 'warning',
//         title: 'Quá thấp!',
//         description: `Số cần tìm lớn hơn ${guessNumber}`,
//         icon: <ArrowUpOutlined style={{ color: '#faad14', fontSize: '32px' }} />
//       };
//       messageType = 'low';
//     } else {
//       newMessage = {
//         type: 'warning',
//         title: 'Quá cao!',
//         description: `Số cần tìm nhỏ hơn ${guessNumber}`,
//         icon: <ArrowDownOutlined style={{ color: '#faad14', fontSize: '32px' }} />
//       };
//       messageType = 'high';
//     }

//     showMessage(newMessage);
//     setGuessHistory([...guessHistory, {
//       guess: guessNumber,
//       message: newMessage.description,
//       type: messageType
//     }]);
//     setGuess('');
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !gameOver) {
//       handleGuess();
//     }
//   };

//   const getHistoryItemColor = (type: string) => {
//     switch(type) {
//       case 'success':
//         return { backgroundColor: '#f6ffed', borderColor: '#b7eb8f', color: '#52c41a' };
//       case 'error':
//         return { backgroundColor: '#fff2f0', borderColor: '#ffccc7', color: '#ff4d4f' };
//       case 'low':
//         return { backgroundColor: '#e6f7ff', borderColor: '#91d5ff', color: '#1890ff' };
//       case 'high':
//         return { backgroundColor: '#fff7e6', borderColor: '#ffd591', color: '#fa8c16' };
//       default:
//         return { backgroundColor: '#f5f5f5', borderColor: '#d9d9d9', color: 'rgba(0, 0, 0, 0.65)' };
//     }
//   };

//   const getHistoryItemIcon = (type: string) => {
//     switch(type) {
//       case 'success':
//         return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
//       case 'error':
//         return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
//       case 'low':
//         return <ArrowUpOutlined style={{ color: '#1890ff' }} />;
//       case 'high':
//         return <ArrowDownOutlined style={{ color: '#fa8c16' }} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Layout className="min-h-screen">
//       <Header
//         style={{
//           background: 'linear-gradient(135deg,rgba(210, 47, 15, 0.89) 0%,rgb(227, 59, 7) 100%)',
//           padding: '16px 0',
//           marginBottom: '24px'
//         }}
//       >
//         <Title
//           level={2}
//           style={{
//             color: '#ffffff',
//             margin: 0,
//             textAlign: 'center',
//             textTransform: 'uppercase',
//             letterSpacing: '2px',
//             textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
//           }}
//         >
//           🎮 Trò Chơi Đoán Số
//         </Title>
//         <Text
//           style={{
//             color: '#002',
//             display: 'block',
//             textAlign: 'center',
//             opacity: 0.8
//           }}
//         >
//           Hãy thử đoán số từ 1 đến 100
//         </Text>
//       </Header>
//       <Content className="p-8" style={{ width: '100%' }}>
//         <Row gutter={[16, 16]} justify="space-between" style={{ width: '100%' }}>
//           <Col xs={24} sm={24} md={18} lg={18} style={{ width: '75%' }}>
//             <Card style={{ width: '100%', height: '100%' }}>
//               <Row gutter={[16, 16]} justify="space-between">
//                 <Col span={12}>
//                   <Statistic
//                     title="Lượt đoán còn lại"
//                     value={remainingAttempts}
//                     prefix={<ReloadOutlined />}
//                   />
//                 </Col>
//                 <Col span={12}>
//                   <Statistic
//                     title="Điểm cao nhất"
//                     value={bestScore}
//                     prefix={<TrophyOutlined />}
//                     suffix="lượt"
//                   />
//                 </Col>
//               </Row>

//               <div style={{ margin: '20px 0' }}>
//                 <Progress
//                   percent={remainingAttempts * 10}
//                   status={hasWon ? "success" : remainingAttempts === 0 ? "exception" : "active"}
//                   showInfo={false}
//                   style={{ height: '20px' }}
//                 />
//               </div>

//               <div style={{ marginTop: '30px', marginBottom: '30px', width: '100%' }}>
//                 <Input
//                   size="large"
//                   type="number"
//                   value={guess}
//                   onChange={(e) => setGuess(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Nhập số của bạn (1-100)"
//                   disabled={gameOver}
//                   min={1}
//                   max={100}
//                   style={{ width: '100%', height: '50px', fontSize: '18px' }}
//                 />
//               </div>

//               <div style={{ textAlign: 'center', marginTop: '30px' }}>
//                 {!gameOver ? (
//                   <Button
//                     type="primary"
//                     size="large"
//                     onClick={handleGuess}
//                     style={{
//                       height: '50px',
//                       width: '200px',
//                       fontSize: '18px',
//                       fontWeight: 'bold'
//                     }}
//                   >
//                     Đoán
//                   </Button>
//                 ) : (
//                   <Button
//                     type="primary"
//                     size="large"
//                     onClick={initializeGame}
//                     icon={<ReloadOutlined />}
//                     style={{
//                       height: '50px',
//                       width: '200px',
//                       fontSize: '18px',
//                       fontWeight: 'bold'
//                     }}
//                   >
//                     Chơi lại
//                   </Button>
//                 )}
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={24} md={6} lg={6} style={{ width: '25%' }}>
//             <Card
//               title={<div style={{ fontWeight: 'bold' }}>Lịch sử đoán</div>}
//               style={{
//                 background: '#fafafa',
//                 height: '100%',
//                 width: '100%'
//               }}
//               bodyStyle={{
//                 maxHeight: '400px',
//                 overflowY: 'auto',
//                 padding: '12px'
//               }}
//             >
//               {guessHistory.map((item, index) => {
//                 const colors = getHistoryItemColor(item.type);
//                 return (
//                   <div
//                     key={index}
//                     className="mb-3 p-2 rounded"
//                     style={{
//                       backgroundColor: colors.backgroundColor,
//                       borderLeft: `3px solid ${colors.borderColor}`,
//                       transition: 'all 0.3s ease',
//                       marginBottom: '10px',
//                       padding: '8px'
//                     }}
//                   >
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                       <Tag color={colors.color === '#52c41a' ? 'success' : colors.color === '#ff4d4f' ? 'error' : 'warning'}>
//                         {index + 1}
//                       </Tag>
//                       <Text strong style={{ marginRight: '8px', color: colors.color }}>
//                         {item.guess}
//                       </Text>
//                       {getHistoryItemIcon(item.type)}
//                     </div>
//                     <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
//                       {item.message}
//                     </Text>
//                   </div>
//                 );
//               })}
//               {guessHistory.length === 0 && (
//                 <Text type="secondary">Chưa có lượt đoán nào</Text>
//               )}
//             </Card>
//           </Col>
//         </Row>

//         <Modal
//           visible={message !== null}
//           footer={null}
//           onCancel={() => setMessage(null)}
//           width={400}
//           centered
//           maskClosable={true}
//         >
//           <Result
//             status={message?.type}
//             icon={message?.icon}
//             title={message?.title}
//             subTitle={message?.description}
//             extra={
//               gameOver ? [
//                 <Button
//                   type="primary"
//                   key="console"
//                   onClick={initializeGame}
//                   icon={<ReloadOutlined />}
//                 >
//                   Chơi lại
//                 </Button>
//               ] : [
//                 <Button
//                   type="primary"
//                   key="continue"
//                   onClick={() => setMessage(null)}
//                 >
//                   Tiếp tục
//                 </Button>
//               ]
//             }
//           />
//         </Modal>
//       </Content>
//     </Layout>
//   );
// };

// export default NumberGuessingGame;
import React, { ReactNode } from 'react';
import { Card, Button, Typography, List, Space, Tag, Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';

const { Title, Text } = Typography;

const renderChoiceIcon = (choice: string, size: string = "3x"): ReactNode => {
  switch (choice) {
    case 'rock':
      return <FontAwesomeIcon icon={faHandRock} size={size} />;
    case 'paper':
      return <FontAwesomeIcon icon={faHandPaper} size={size} />;
    case 'scissors':
      return <FontAwesomeIcon icon={faHandScissors} size={size} />;
    default:
      return null;
  }
};

const getResultColor = (result: 'win' | 'lose' | 'draw'): string => {
  return result === 'win' ? 'green' : result === 'lose' ? 'red' : 'gray';
};

const getChoiceName = (choice: string) => {
  return choice === 'rock' ? 'Búa' : choice === 'paper' ? 'Bao' : 'Kéo';
};

const RockPaperScissors: React.FC = () => {
  const [gameHistory, setGameHistory] = React.useState<
    { playerChoice: string; computerChoice: string; result: 'win' | 'lose' | 'draw' }[]
  >([]);

  const choices = ['rock', 'paper', 'scissors'];

  const getComputerChoice = () => choices[Math.floor(Math.random() * 3)];

  const determineResult = (playerChoice: string, computerChoice: string): 'win' | 'lose' | 'draw' => {
    if (playerChoice === computerChoice) return 'draw';
    return (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    )
      ? 'win'
      : 'lose';
  };

  const playGame = (playerChoice: string) => {
    const computerChoice = getComputerChoice();
    const result = determineResult(playerChoice, computerChoice);
    setGameHistory(prev => [{ playerChoice, computerChoice, result }, ...prev]);
  };

  return (
    <Row gutter={24} style={{ margin: '30px' }}>
      {/* Cột bên trái: Trò chơi + Kết quả mới nhất */}
      <Col span={12}>
        <Card 
          title="🕹 Oẳn Tù Tì - Rock Paper Scissors"
          style={{ textAlign: 'center', borderRadius: 10, minHeight: 400 }}
          headStyle={{ backgroundColor: 'red', color: 'white', textAlign: 'center' }}
        >
          <Title level={4} style={{ marginBottom: 20 }}>Chọn lựa của bạn</Title>
          <Space size="large">
            {choices.map(choice => (
              <Button 
                key={choice} 
                onClick={() => playGame(choice)}
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: choice === 'rock' ? '#f5222d' : choice === 'paper' ? '#52c41a' : '#faad14',
                  color: 'white',
                  fontSize: '24px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {renderChoiceIcon(choice, "3x")}
              </Button>
            ))}
          </Space>

          {/* Kết quả mới nhất ngay bên dưới lựa chọn của người chơi */}
          {gameHistory.length > 0 && (
            <Card style={{ marginTop: 20, textAlign: 'center', backgroundColor: '#f0f2f5', borderRadius: 10 }}>
              <Title level={4}>🎮 Kết quả mới nhất</Title>
              <Text strong>Bạn:</Text> {renderChoiceIcon(gameHistory[0].playerChoice, "2x")} <Text>({getChoiceName(gameHistory[0].playerChoice)})</Text>
              <br />
              <Text strong>Máy:</Text> {renderChoiceIcon(gameHistory[0].computerChoice, "2x")} <Text>({getChoiceName(gameHistory[0].computerChoice)})</Text>
              <br />
              <Tag color={getResultColor(gameHistory[0].result)} style={{ marginTop: 10, fontSize: '16px' }}>
                {gameHistory[0].result === 'win' ? '🎉 Bạn thắng!' : gameHistory[0].result === 'lose' ? '😞 Bạn thua' : '🤝 Hòa'}
              </Tag>
            </Card>
          )}
        </Card>
      </Col>

      {/* Cột bên phải: Lịch sử trò chơi có thanh cuộn, chiều cao bằng phần bên trái */}
      <Col span={12}>
        <Card title="📜 Lịch sử trò chơi" style={{ borderRadius: 10, minHeight: 400 }}>
          <div style={{ maxHeight: 350, overflowY: 'auto', paddingRight: 10 }}>
            <List
              dataSource={gameHistory}
              renderItem={item => (
                <List.Item>
                  <Space>
                    <Text>Bạn: {renderChoiceIcon(item.playerChoice, "lg")}</Text>
                    <Text>Máy: {renderChoiceIcon(item.computerChoice, "lg")}</Text>
                    <Tag color={getResultColor(item.result)}>
                      {item.result === 'win' ? 'Thắng' : item.result === 'lose' ? 'Thua' : 'Hòa'}
                    </Tag>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default RockPaperScissors;