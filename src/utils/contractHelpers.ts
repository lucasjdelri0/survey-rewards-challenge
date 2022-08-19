import { ethers } from 'ethers'
import quizTokenAbi from 'config/abi/quizToken.json'
import { QUIZ_TOKEN_ADDRESS } from 'config/constants'

export const getQuizContract = (
  signerOrProvider?: ethers.Signer | ethers.providers.Provider
): ethers.Contract => {
  return new ethers.Contract(QUIZ_TOKEN_ADDRESS, quizTokenAbi, signerOrProvider)
}
