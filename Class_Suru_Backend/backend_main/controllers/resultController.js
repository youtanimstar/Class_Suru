import { getUserResult as getUserResultModel, getResultByAnswerId as getResultByAnswerIdModel } from "../models/resultModel.js";

 const getUserResult = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getUserResultModel(userId);
    
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 const getResultByAnswerId = async (req, res) => {
  try {
    const { answerId } = req.params;
    const result = await getResultByAnswerIdModel(answerId);

    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }
    
    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getUserResult, getResultByAnswerId }; // ✅ Correct export for other modules to use    
