//Hàm phân trang
module.exports = (page, totalPage, delta=2)=>{
    //Truyền vảo 3 tham sô gồm số trang hiện tại,tổng số trang,biên độ
    const pages = [];
    const pagesWithDot = [];//Bao gồm cả dấu chấm (mảng hoàn thiện)

    //Biên độ
    const left = page - delta;
    const right = page + delta;

    //tạo mảng số
    for(let i =1;i<=totalPage;i++){
        if(i===1||i===totalPage||i===page||(left<=i && i <=right)){
        //Nếu i đồng nhất bằng 1 hoặc i đồng nhất totalPage hoặc i đồng nhất với page hoặc i>=left && i<= right
            pages.push(i);
        }else if(i===left-1 || i=== right+1){
            pages.push("...");
        }
    }
    return pages;
}